package com.sospl.inventory.repository.auth;

import com.sospl.inventory.model.auth.SosUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SosUserRepository extends JpaRepository<SosUser, Long> {

    @Query("SELECT u FROM SosUser u WHERE u.username = :username AND u.isDeleted = false")
    Optional<SosUser> findByUsernameAndIsDeletedFalse(@Param("username") String username);

    @Query("SELECT u FROM SosUser u WHERE u.email = :email AND u.isDeleted = false")
    Optional<SosUser> findByEmailAndIsDeletedFalse(@Param("email") String email);

    @Query("SELECT u FROM SosUser u WHERE u.username = :username")
    Optional<SosUser> findByUsername(@Param("username") String username);

    @Query("SELECT u FROM SosUser u WHERE u.email = :email")
    Optional<SosUser> findByEmail(@Param("email") String email);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM SosUser u WHERE u.username = :username")
    Boolean existsByUsername(@Param("username") String username);

    @Query("SELECT CASE WHEN COUNT(u) > 0 THEN true ELSE false END FROM SosUser u WHERE u.email = :email")
    Boolean existsByEmail(@Param("email") String email);

    @Query("SELECT u FROM SosUser u WHERE u.isDeleted = false")
    List<SosUser> findAllByIsDeletedFalse();

    @Query("SELECT u FROM SosUser u WHERE u.isActive = true AND u.isDeleted = false")
    List<SosUser> findAllByIsActiveTrueAndIsDeletedFalse();

    @Query("SELECT u FROM SosUser u WHERE u.isDeleted = false AND u.isActive = true AND " +
           "(LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(u.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<SosUser> searchUsers(@Param("keyword") String keyword);
}