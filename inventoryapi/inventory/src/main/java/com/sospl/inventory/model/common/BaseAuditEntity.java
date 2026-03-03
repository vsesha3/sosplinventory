package com.sospl.inventory.model.common;

import jakarta.persistence.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(AuditListener.class)
@Where(clause = "is_deleted = false")
public abstract class BaseAuditEntity {

    @Column(name = "is_active", columnDefinition = "TINYINT(1)")
    protected Boolean isActive = true;

    @Column(name = "is_deleted", columnDefinition = "TINYINT(1)")
    protected Boolean isDeleted = false;

    @Column(name = "created_by", length = 100)
    protected String createdBy;

    @Column(name = "created_at")
    protected LocalDateTime createdAt;

    @Column(name = "updated_by", length = 100)
    protected String updatedBy;

    @Column(name = "updated_at")
    protected LocalDateTime updatedAt;

    @Column(name = "deleted_by", length = 100)
    protected String deletedBy;

    @Column(name = "deleted_at")
    protected LocalDateTime deletedAt;

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }

    public Boolean getIsDeleted() { return isDeleted; }
    public void setIsDeleted(Boolean isDeleted) { this.isDeleted = isDeleted; }

    public String getCreatedBy() { return createdBy; }
    public void setCreatedBy(String createdBy) { this.createdBy = createdBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }

    public String getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(String updatedBy) { this.updatedBy = updatedBy; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }

    public String getDeletedBy() { return deletedBy; }
    public void setDeletedBy(String deletedBy) { this.deletedBy = deletedBy; }

    public LocalDateTime getDeletedAt() { return deletedAt; }
}