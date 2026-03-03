package com.sospl.inventory.model.common;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import java.time.LocalDateTime;

public class AuditListener {

    @PrePersist
    public void setCreatedAt(BaseAuditEntity entity) {
        entity.createdAt = LocalDateTime.now();
        entity.updatedAt = LocalDateTime.now();
        if (entity.isActive == null) entity.isActive = true;
        if (entity.isDeleted == null) entity.isDeleted = false;
    }

    @PreUpdate
    public void setUpdatedAt(BaseAuditEntity entity) {
        entity.updatedAt = LocalDateTime.now();
    }
}