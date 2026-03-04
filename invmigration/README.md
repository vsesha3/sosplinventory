# Oracle → MySQL Data Migrator

A production-grade Java tool to migrate data from Oracle to MySQL on-premises.
Designed for **data-only** migration (tables already exist in MySQL).

---

## Features
- ✅ Batched `INSERT` (configurable batch size, default 1000)
- ✅ Multi-threaded — migrates multiple tables in parallel
- ✅ Automatic Oracle→MySQL type mapping (NUMBER, VARCHAR2, DATE, CLOB, BLOB, TIMESTAMP…)
- ✅ `TRUNCATE` before insert for safe re-runs
- ✅ HikariCP connection pooling
- ✅ Per-table progress logging + final summary report
- ✅ Table name remapping support

---

## Prerequisites

| Requirement | Version |
|---|---|
| Java | 11+ |
| Maven | 3.6+ |
| Oracle JDBC Driver (`ojdbc8.jar`) | 21.x |
| MySQL | 5.7 / 8.x |

---

## Setup

### 1. Install Oracle JDBC Driver (manual step)
Oracle's driver is not on Maven Central. Download `ojdbc8.jar` from:
https://www.oracle.com/database/technologies/appdev/jdbc-downloads.html

Then install it to your local Maven repo:
```bash
mvn install:install-file \
  -Dfile=ojdbc8.jar \
  -DgroupId=com.oracle.database.jdbc \
  -DartifactId=ojdbc8 \
  -Dversion=21.9.0.0 \
  -Dpackaging=jar
```

### 2. Configure `migration.properties`
Edit the file and set:
- Oracle JDBC URL, username, password, schema
- MySQL JDBC URL, username, password
- Comma-separated list of tables to migrate

### 3. Build
```bash
mvn clean package -DskipTests
```

### 4. Run
```bash
java -jar target/oracle-mysql-migrator-1.0.0.jar migration.properties
```

---

## Configuration Reference

| Property | Default | Description |
|---|---|---|
| `oracle.url` | — | Oracle JDBC URL |
| `oracle.username` | — | Oracle user |
| `oracle.password` | — | Oracle password |
| `oracle.schema` | *(empty)* | Schema/owner prefix for table names |
| `mysql.url` | — | MySQL JDBC URL |
| `mysql.username` | — | MySQL user |
| `mysql.password` | — | MySQL password |
| `migration.tables` | — | Comma-separated Oracle table names (UPPERCASE) |
| `migration.batch_size` | `1000` | Rows per batch INSERT |
| `migration.threads` | `4` | Parallel table threads |
| `migration.truncate_before` | `true` | Truncate MySQL table before inserting |
| `table.map.ORACLE_NAME` | lowercase of Oracle name | Remap Oracle→MySQL table name |

---

## Oracle → MySQL Type Mapping

| Oracle Type | MySQL Type |
|---|---|
| `NUMBER` | `DECIMAL` / `BIGINT` |
| `VARCHAR2`, `NVARCHAR2` | `VARCHAR` |
| `CHAR`, `NCHAR` | `CHAR` |
| `DATE` | `DATETIME` |
| `TIMESTAMP` | `TIMESTAMP` |
| `CLOB`, `NCLOB` | `LONGTEXT` |
| `BLOB` | `LONGBLOB` |
| `FLOAT` | `DOUBLE` |

---

## Tips for 1–10GB Datasets

- Set `migration.batch_size=2000` for faster throughput
- Set `migration.threads=4` (or match your CPU cores)
- Add `innodb_buffer_pool_size=2G` to MySQL `my.cnf` before migrating
- Disable MySQL binary logging temporarily: `SET sql_log_bin=0;`
- Re-enable foreign key checks after migration

---

## Integration with Your Spring Boot Project

If you want to trigger migration from your existing Spring Boot backend,
you can import this class and call `new OracleToMySQLMigrator(props).run()`
from a `@Service` or `CommandLineRunner`.
