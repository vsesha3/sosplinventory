package com.migration;

import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileInputStream;
import java.io.IOException;
import java.sql.*;
import java.util.*;
import java.util.concurrent.*;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Oracle → MySQL Data Migrator
 *
 * Features:
 *  - Batched inserts (configurable batch size)
 *  - Multi-threaded table-level parallelism
 *  - Automatic type mapping (Oracle → MySQL)
 *  - Column name remapping (e.g. CREATED_ON → created_at)
 *  - Column exclusion (e.g. drop excise cols that no longer exist in MySQL)
 *  - TRUNCATE before migrate (safe re-run)
 *  - Progress logging per table
 *  - Summary report at the end
 *
 * Usage:
 *   java -jar oracle-mysql-migrator.jar migration.properties
 */
public class OracleToMySQLMigrator {

    private static final Logger log = LoggerFactory.getLogger(OracleToMySQLMigrator.class);

    // ── Column name remapping: Oracle column name → MySQL column name ────────
    // Keys are UPPER-CASE Oracle column names, values are MySQL column names.
    private static final Map<String, String> COLUMN_REMAP = new HashMap<>();
    static {
        COLUMN_REMAP.put("CREATED_ON",      "created_at");
        COLUMN_REMAP.put("LAST_UPDATED_ON", "updated_at");
        COLUMN_REMAP.put("LAST_UPDATED_BY", "updated_by");
        COLUMN_REMAP.put("ISACTIVE",        "is_active");

        // ← Add these
        COLUMN_REMAP.put("CREATED_DATE",    "created_at");
        COLUMN_REMAP.put("UPDATED_DATE",    "updated_at");
        COLUMN_REMAP.put("UPDATED_BY",      "updated_by");
        COLUMN_REMAP.put("CREATED_BY",      "created_by");
    }

    // ── Columns that exist in Oracle but have been DROPPED in MySQL ──────────
    // (e.g. excise cols removed due to GST migration)
    // Any Oracle column whose UPPER-CASE name is in this set will be skipped.
    private static final Set<String> EXCLUDED_COLUMNS = new HashSet<>(Arrays.asList(
    	    "EXCISE_TARIFF_NO",
    	    "EXCISE_DECLARED_ITEM",
    	    "EXCISE_RATE",
    	    "E_CESS_RATE",
    	    "SH_E_CESS_RATE",

    	    // ← Add these if not needed
    	    "PO_CENVAT",
    	    "PO_CENVAT_RATE"
    	));
    // ── Columns that store Y/N in Oracle but are TINYINT(1) in MySQL ─────────
    // 'Y' → 1,  anything else (including 'N', null) → 0
    private static final Set<String> YN_TO_BIT_COLUMNS = new HashSet<>(Arrays.asList(
        "ACTIVE_FLAG",
        "ISACTIVE"
    ));

    // ── Configuration keys ──────────────────────────────────────────────────
    private final Properties config;

    // ── Connection pools ────────────────────────────────────────────────────
    private HikariDataSource oraclePool;
    private HikariDataSource mysqlPool;

    // ── Stats ────────────────────────────────────────────────────────────────
    private final Map<String, Long>   rowsMigrated = new ConcurrentHashMap<>();
    private final Map<String, Long>   rowsFailed   = new ConcurrentHashMap<>();
    private final Map<String, String> tableErrors  = new ConcurrentHashMap<>();

    public OracleToMySQLMigrator(Properties config) {
        this.config = config;
    }

    // ════════════════════════════════════════════════════════════════════════
    //  ENTRY POINT
    // ════════════════════════════════════════════════════════════════════════
    public static void main(String[] args) throws Exception {
        String configFile = (args.length > 0) ? args[0] : "migration.properties";
        Properties props = new Properties();
        try (FileInputStream fis = new FileInputStream(configFile)) {
            props.load(fis);
        } catch (IOException e) {
            log.error("Cannot load config file '{}': {}", configFile, e.getMessage());
            System.exit(1);
        }

        OracleToMySQLMigrator migrator = new OracleToMySQLMigrator(props);
        migrator.run();
    }

    // ════════════════════════════════════════════════════════════════════════
    //  MAIN FLOW
    // ════════════════════════════════════════════════════════════════════════
    public void run() throws Exception {
        log.info("==========================================================");
        log.info("  Oracle → MySQL Data Migrator  (v1.1)");
        log.info("==========================================================");

        initConnectionPools();

        List<String> tables = getTableList();
        log.info("Tables to migrate: {}", tables);

        int threads = Integer.parseInt(config.getProperty("migration.threads", "4"));
        ExecutorService executor = Executors.newFixedThreadPool(threads);
        List<Future<?>> futures = new ArrayList<>();

        long startAll = System.currentTimeMillis();

        for (String table : tables) {
            futures.add(executor.submit(() -> migrateTable(table)));
        }

        for (Future<?> f : futures) {
            try { f.get(); }
            catch (ExecutionException e) { log.error("Unexpected error in thread", e.getCause()); }
        }

        executor.shutdown();
        executor.awaitTermination(1, TimeUnit.HOURS);

        printSummary(System.currentTimeMillis() - startAll);
        closeConnectionPools();
    }

    // ════════════════════════════════════════════════════════════════════════
    //  TABLE MIGRATION
    // ════════════════════════════════════════════════════════════════════════
    private void migrateTable(String oracleTable) {
        String mysqlTable   = config.getProperty("table.map." + oracleTable, oracleTable.toLowerCase());
        int    batchSize    = Integer.parseInt(config.getProperty("migration.batch_size", "1000"));
        String oracleSchema = config.getProperty("oracle.schema", "").toUpperCase();
        String qualifiedOracle = oracleSchema.isEmpty() ? oracleTable : oracleSchema + "." + oracleTable;

        log.info("[{}] Starting migration → MySQL table '{}'", oracleTable, mysqlTable);
        long tableStart = System.currentTimeMillis();
        AtomicLong inserted = new AtomicLong(0);
        AtomicLong failed   = new AtomicLong(0);

        try (Connection oracleConn = oraclePool.getConnection();
             Connection mysqlConn  = mysqlPool.getConnection()) {

            mysqlConn.setAutoCommit(false);

            // Optional truncate
            if (Boolean.parseBoolean(config.getProperty("migration.truncate_before", "true"))) {
                try (Statement st = mysqlConn.createStatement()) {
                    st.execute("SET FOREIGN_KEY_CHECKS=0");
                    st.execute("TRUNCATE TABLE `" + mysqlTable + "`");
                    st.execute("SET FOREIGN_KEY_CHECKS=1");
                    mysqlConn.commit();
                    log.info("[{}] Truncated target table '{}'", oracleTable, mysqlTable);
                }
            }

            // Fetch Oracle column metadata, then filter/remap for MySQL
            List<ColumnMeta> oracleColumns = getOracleColumns(oracleConn, qualifiedOracle);
            if (oracleColumns.isEmpty()) {
                log.warn("[{}] No columns found — skipping", oracleTable);
                tableErrors.put(oracleTable, "No columns found");
                return;
            }

            // Apply exclusions and remapping — build the final list of columns to migrate
            List<ColumnMeta> activeColumns = applyColumnMappings(oracleTable, oracleColumns);
            if (activeColumns.isEmpty()) {
                log.warn("[{}] All columns excluded — skipping", oracleTable);
                tableErrors.put(oracleTable, "All columns excluded");
                return;
            }

            String insertSQL = buildInsertSQL(mysqlTable, activeColumns);
            log.debug("[{}] INSERT SQL: {}", oracleTable, insertSQL);

            String selectSQL = buildSelectSQL(qualifiedOracle, oracleColumns); // SELECT uses original Oracle names
            try (PreparedStatement selectStmt = oracleConn.prepareStatement(
                         selectSQL, ResultSet.TYPE_FORWARD_ONLY, ResultSet.CONCUR_READ_ONLY);
                 PreparedStatement insertStmt = mysqlConn.prepareStatement(insertSQL)) {

                selectStmt.setFetchSize(batchSize);
                ResultSet rs = selectStmt.executeQuery();

                int batchCount = 0;
                while (rs.next()) {
                    try {
                        populateInsertStatement(insertStmt, rs, activeColumns);
                        insertStmt.addBatch();
                        batchCount++;

                        if (batchCount >= batchSize) {
                            int[] counts = insertStmt.executeBatch();
                            mysqlConn.commit();
                            inserted.addAndGet(Arrays.stream(counts).filter(c -> c >= 0).asLongStream().sum());
                            batchCount = 0;
                            log.info("[{}] Progress: {} rows inserted...", oracleTable, inserted.get());
                        }
                    } catch (SQLException rowEx) {
                        failed.incrementAndGet();
                        log.warn("[{}] Row error: {}", oracleTable, rowEx.getMessage());
                    }
                }

                // Flush remaining
                if (batchCount > 0) {
                    int[] counts = insertStmt.executeBatch();
                    mysqlConn.commit();
                    inserted.addAndGet(Arrays.stream(counts).filter(c -> c >= 0).asLongStream().sum());
                }
            }

        } catch (Exception e) {
            log.error("[{}] Migration FAILED: {}", oracleTable, e.getMessage(), e);
            tableErrors.put(oracleTable, e.getMessage());
        }

        long elapsed = System.currentTimeMillis() - tableStart;
        log.info("[{}] Done — inserted={}, failed={}, time={}s",
                oracleTable, inserted.get(), failed.get(), elapsed / 1000);
        rowsMigrated.put(oracleTable, inserted.get());
        rowsFailed.put(oracleTable, failed.get());
    }

    // ════════════════════════════════════════════════════════════════════════
    //  COLUMN MAPPING — exclusions + renames
    // ════════════════════════════════════════════════════════════════════════

    /**
     * Takes the raw Oracle column list and returns a filtered + renamed list:
     *  - Drops any column in EXCLUDED_COLUMNS
     *  - Applies COLUMN_REMAP to rename Oracle col names → MySQL col names
     *  - Preserves the original Oracle ResultSet index so data reads still work
     */
    private List<ColumnMeta> applyColumnMappings(String oracleTable, List<ColumnMeta> oracleColumns) {
        List<ColumnMeta> active = new ArrayList<>();
        for (ColumnMeta col : oracleColumns) {
            String upperName = col.name.toUpperCase();

            if (EXCLUDED_COLUMNS.contains(upperName)) {
                log.debug("[{}] Skipping excluded column: {}", oracleTable, col.name);
                continue;
            }

            ColumnMeta mapped = new ColumnMeta();
            mapped.index    = col.index;       // keep original RS index for reading
            mapped.sqlType  = col.sqlType;
            mapped.typeName = col.typeName;
            mapped.name     = col.name;        // original name (used for RS reads if needed)

            // Apply rename for MySQL INSERT target column name
            mapped.mysqlName = COLUMN_REMAP.getOrDefault(upperName, col.name.toLowerCase());

            active.add(mapped);
        }
        log.info("[{}] Migrating {}/{} columns (excluded: {})",
                oracleTable, active.size(), oracleColumns.size(),
                oracleColumns.size() - active.size());
        return active;
    }

    // ════════════════════════════════════════════════════════════════════════
    //  COLUMN METADATA
    // ════════════════════════════════════════════════════════════════════════
    private List<ColumnMeta> getOracleColumns(Connection conn, String qualifiedTable) throws SQLException {
        List<ColumnMeta> columns = new ArrayList<>();
        try (PreparedStatement ps = conn.prepareStatement(
                "SELECT * FROM " + qualifiedTable + " WHERE 1=0")) {
            ResultSetMetaData meta = ps.getMetaData();
            for (int i = 1; i <= meta.getColumnCount(); i++) {
                ColumnMeta col = new ColumnMeta();
                col.index    = i;
                col.name     = meta.getColumnName(i);
                col.sqlType  = meta.getColumnType(i);
                col.typeName = meta.getColumnTypeName(i);
                col.mysqlName = col.name.toLowerCase(); // default, overridden by applyColumnMappings
                columns.add(col);
            }
        }
        return columns;
    }

    // ════════════════════════════════════════════════════════════════════════
    //  SQL BUILDERS
    // ════════════════════════════════════════════════════════════════════════

    /**
     * SELECT uses original Oracle column names (with CLOB handling).
     * We always SELECT all Oracle columns; exclusion is handled at INSERT time.
     */
    private String buildSelectSQL(String qualifiedTable, List<ColumnMeta> columns) {
        StringBuilder sb = new StringBuilder("SELECT ");
        for (int i = 0; i < columns.size(); i++) {
            if (i > 0) sb.append(", ");
            ColumnMeta col = columns.get(i);
            if ("CLOB".equalsIgnoreCase(col.typeName) || "NCLOB".equalsIgnoreCase(col.typeName)) {
                sb.append("DBMS_LOB.SUBSTR(").append(col.name).append(", 32767, 1) AS ").append(col.name);
            } else {
                sb.append(col.name);
            }
        }
        sb.append(" FROM ").append(qualifiedTable);
        return sb.toString();
    }

    /**
     * INSERT uses mysqlName (remapped, lowercase) for the target column list.
     * Only activeColumns (post-exclusion) are included.
     */
    private String buildInsertSQL(String mysqlTable, List<ColumnMeta> activeColumns) {
        StringBuilder cols = new StringBuilder();
        StringBuilder vals = new StringBuilder();
        for (int i = 0; i < activeColumns.size(); i++) {
            if (i > 0) { cols.append(", "); vals.append(", "); }
            cols.append("`").append(activeColumns.get(i).mysqlName).append("`");
            vals.append("?");
        }
        return "INSERT INTO `" + mysqlTable + "` (" + cols + ") VALUES (" + vals + ")";
    }

    // ════════════════════════════════════════════════════════════════════════
    //  TYPE MAPPING  Oracle → MySQL via JDBC setObject
    //  NOTE: ps index is 1-based position within activeColumns (not Oracle RS index)
    // ════════════════════════════════════════════════════════════════════════
    private void populateInsertStatement(PreparedStatement ps, ResultSet rs, List<ColumnMeta> activeColumns)
            throws SQLException {

        for (int i = 0; i < activeColumns.size(); i++) {
            ColumnMeta col  = activeColumns.get(i);
            int        psIdx = i + 1;          // PreparedStatement is 1-based by position
            int        rsIdx = col.index;       // ResultSet index from Oracle (original position)

            switch (col.sqlType) {

                case Types.NUMERIC:
                case Types.DECIMAL:
                    ps.setBigDecimal(psIdx, rs.getBigDecimal(rsIdx));
                    break;

                case Types.INTEGER:
                case Types.SMALLINT:
                case Types.TINYINT:
                    int intVal = rs.getInt(rsIdx);
                    if (rs.wasNull()) ps.setNull(psIdx, Types.INTEGER);
                    else              ps.setInt(psIdx, intVal);
                    break;

                case Types.BIGINT:
                    long longVal = rs.getLong(rsIdx);
                    if (rs.wasNull()) ps.setNull(psIdx, Types.BIGINT);
                    else              ps.setLong(psIdx, longVal);
                    break;

                case Types.FLOAT:
                case Types.DOUBLE:
                case Types.REAL:
                    double dblVal = rs.getDouble(rsIdx);
                    if (rs.wasNull()) ps.setNull(psIdx, Types.DOUBLE);
                    else              ps.setDouble(psIdx, dblVal);
                    break;

                case Types.CHAR:
                case Types.VARCHAR:
                case Types.NCHAR:
                case Types.NVARCHAR:
                case Types.LONGNVARCHAR:
                case Types.LONGVARCHAR:
                    // Convert Y/N flag columns → TINYINT(1) for MySQL BOOLEAN columns
                    if (YN_TO_BIT_COLUMNS.contains(col.name.toUpperCase())) {
                        String flagVal = rs.getString(rsIdx);
                        if (rs.wasNull() || flagVal == null) {
                            ps.setNull(psIdx, Types.TINYINT);
                        } else {
                            ps.setInt(psIdx, "Y".equalsIgnoreCase(flagVal.trim()) ? 1 : 0);
                        }
                    } else {
                        ps.setString(psIdx, rs.getString(rsIdx));
                    }
                    break;

                case Types.CLOB:
                case Types.NCLOB:
                    Clob clob = rs.getClob(rsIdx);
                    if (clob == null) ps.setNull(psIdx, Types.LONGVARCHAR);
                    else              ps.setString(psIdx, clob.getSubString(1, (int) clob.length()));
                    break;

                case Types.DATE:
                    // Oracle DATE includes time component — use Timestamp to avoid data loss
                    Timestamp ts = rs.getTimestamp(rsIdx);
                    if (ts == null) ps.setNull(psIdx, Types.TIMESTAMP);
                    else            ps.setTimestamp(psIdx, ts);
                    break;

                case Types.TIME:
                    ps.setTime(psIdx, rs.getTime(rsIdx));
                    break;

                case Types.TIMESTAMP:
                    ps.setTimestamp(psIdx, rs.getTimestamp(rsIdx));
                    break;

                case Types.BLOB:
                    Blob blob = rs.getBlob(rsIdx);
                    if (blob == null) ps.setNull(psIdx, Types.BLOB);
                    else              ps.setBytes(psIdx, blob.getBytes(1, (int) blob.length()));
                    break;

                case Types.BINARY:
                case Types.VARBINARY:
                case Types.LONGVARBINARY:
                    ps.setBytes(psIdx, rs.getBytes(rsIdx));
                    break;

                case Types.BOOLEAN:
                case Types.BIT:
                    boolean boolVal = rs.getBoolean(rsIdx);
                    if (rs.wasNull()) ps.setNull(psIdx, Types.BOOLEAN);
                    else              ps.setBoolean(psIdx, boolVal);
                    break;

                default:
                    Object val = rs.getObject(rsIdx);
                    if (val == null) ps.setNull(psIdx, col.sqlType);
                    else             ps.setObject(psIdx, val);
                    break;
            }

            // Final null safety for non-primitive paths (BigDecimal, String, bytes)
            if (rs.wasNull()) ps.setNull(psIdx, col.sqlType);
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    //  CONNECTION POOLS
    // ════════════════════════════════════════════════════════════════════════
    private void initConnectionPools() {
        HikariConfig oracleCfg = new HikariConfig();
        oracleCfg.setJdbcUrl(config.getProperty("oracle.url"));
        oracleCfg.setUsername(config.getProperty("oracle.username"));
        oracleCfg.setPassword(config.getProperty("oracle.password"));
        oracleCfg.setDriverClassName("oracle.jdbc.OracleDriver");
        oracleCfg.setMaximumPoolSize(Integer.parseInt(config.getProperty("migration.threads", "4")) + 1);
        oracleCfg.setConnectionTimeout(30000);
        oracleCfg.setPoolName("OraclePool");
        oraclePool = new HikariDataSource(oracleCfg);
        log.info("Oracle connection pool initialized");

        HikariConfig mysqlCfg = new HikariConfig();
        mysqlCfg.setJdbcUrl(config.getProperty("mysql.url"));
        mysqlCfg.setUsername(config.getProperty("mysql.username"));
        mysqlCfg.setPassword(config.getProperty("mysql.password"));
        mysqlCfg.setDriverClassName("com.mysql.cj.jdbc.Driver");
        mysqlCfg.setMaximumPoolSize(Integer.parseInt(config.getProperty("migration.threads", "4")) + 1);
        mysqlCfg.setConnectionTimeout(30000);
        mysqlCfg.setPoolName("MySQLPool");
        mysqlCfg.addDataSourceProperty("rewriteBatchedStatements", "true");
        mysqlCfg.addDataSourceProperty("useServerPrepStmts",       "false");
        mysqlCfg.addDataSourceProperty("cachePrepStmts",           "true");
        mysqlPool = new HikariDataSource(mysqlCfg);
        log.info("MySQL connection pool initialized");
    }

    private void closeConnectionPools() {
        if (oraclePool != null) oraclePool.close();
        if (mysqlPool  != null) mysqlPool.close();
    }

    // ════════════════════════════════════════════════════════════════════════
    //  HELPERS
    // ════════════════════════════════════════════════════════════════════════
    private List<String> getTableList() {
        String raw = config.getProperty("migration.tables", "");
        if (raw.isBlank()) {
            log.error("No tables specified in migration.tables property");
            System.exit(1);
        }
        List<String> tables = new ArrayList<>();
        for (String t : raw.split(",")) {
            String trimmed = t.trim().toUpperCase();
            if (!trimmed.isEmpty()) tables.add(trimmed);
        }
        return tables;
    }

    private void printSummary(long totalMs) {
        log.info("");
        log.info("══════════════════ MIGRATION SUMMARY ══════════════════");
        log.info("{:<30} {:>12} {:>10} {}", "TABLE", "INSERTED", "FAILED", "STATUS");
        log.info("────────────────────────────────────────────────────────");

        long totalInserted = 0, totalFailed = 0;
        for (String table : rowsMigrated.keySet()) {
            long ins  = rowsMigrated.getOrDefault(table, 0L);
            long fail = rowsFailed.getOrDefault(table, 0L);
            String status = tableErrors.containsKey(table) ? "ERROR" : "OK";
            log.info(String.format("%-30s %12d %10d %s", table, ins, fail, status));
            totalInserted += ins;
            totalFailed   += fail;
        }

        log.info("────────────────────────────────────────────────────────");
        log.info(String.format("%-30s %12d %10d", "TOTAL", totalInserted, totalFailed));
        log.info("Total time: {} seconds", totalMs / 1000);
        log.info("══════════════════════════════════════════════════════════");

        if (!tableErrors.isEmpty()) {
            log.warn("Tables with errors:");
            tableErrors.forEach((t, e) -> log.warn("  {} → {}", t, e));
        }
    }

    // ════════════════════════════════════════════════════════════════════════
    //  INNER CLASS
    // ════════════════════════════════════════════════════════════════════════
    static class ColumnMeta {
        int    index;       // Oracle ResultSet position (1-based) — used for rs.getXxx(index)
        String name;        // Original Oracle column name
        String mysqlName;   // Target MySQL column name (remapped/lowercased)
        int    sqlType;
        String typeName;
    }
}
