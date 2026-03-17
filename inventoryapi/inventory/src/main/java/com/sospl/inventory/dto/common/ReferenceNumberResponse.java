package com.sospl.inventory.dto.common;

public class ReferenceNumberResponse {

    private String referenceNumber;  // e.g. RM/0033/2025-2026

    public ReferenceNumberResponse(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }

    public String getReferenceNumber() { return referenceNumber; }
    public void setReferenceNumber(String referenceNumber) {
        this.referenceNumber = referenceNumber;
    }
}