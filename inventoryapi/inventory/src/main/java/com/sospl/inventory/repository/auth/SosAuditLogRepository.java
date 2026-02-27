package com.sospl.inventory.repository.auth;

import com.sospl.inventory.model.auth.SosAuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SosAuditLogRepository extends JpaRepository<SosAuditLog, Long> {

    List<SosAuditLog> findAllByTableName(String tableName);

    List<SosAuditLog> findAllByPerformedBy(String performedBy);

    List<SosAuditLog> findAllByRecordId(Long recordId);

    List<SosAuditLog> findAllByAction(String action);

    @Query("SELECT a FROM SosAuditLog a WHERE a.tableName = :tableName " +
           "AND a.recordId = :recordId ORDER BY a.performedAt DESC")
    List<SosAuditLog> findAuditHistoryByTableAndRecord(@Param("tableName") String tableName,
                                                        @Param("recordId") Long recordId);

    @Query("SELECT a FROM SosAuditLog a WHERE a.performedAt BETWEEN :startDate " +
           "AND :endDate ORDER BY a.performedAt DESC")
    List<SosAuditLog> findAuditLogsBetweenDates(@Param("startDate") LocalDateTime startDate,
                                                 @Param("endDate") LocalDateTime endDate);
}