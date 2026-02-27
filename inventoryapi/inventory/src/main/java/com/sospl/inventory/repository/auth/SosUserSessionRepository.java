package com.sospl.inventory.repository.auth;

import com.sospl.inventory.model.auth.SosUserSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SosUserSessionRepository extends JpaRepository<SosUserSession, Long> {

    Optional<SosUserSession> findByToken(String token);

    Optional<SosUserSession> findByTokenAndIsActiveTrueAndIsDeletedFalse(String token);

    List<SosUserSession> findAllByUserIdAndIsDeletedFalse(Long userId);

    List<SosUserSession> findAllByUserIdAndIsActiveTrueAndIsDeletedFalse(Long userId);

    @Modifying
    @Transactional
    @Query("UPDATE SosUserSession s SET s.isActive = false, s.updatedAt = :now " +
           "WHERE s.userId = :userId AND s.isActive = true")
    void deactivateAllSessionsByUserId(@Param("userId") Long userId,
                                       @Param("now") LocalDateTime now);

    @Modifying
    @Transactional
    @Query("UPDATE SosUserSession s SET s.isActive = false, s.updatedAt = :now " +
           "WHERE s.expiresAt < :now AND s.isActive = true")
    void deactivateExpiredSessions(@Param("now") LocalDateTime now);
}