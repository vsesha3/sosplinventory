package com.sospl.inventory.dto.common;

public class DropDownResponse {

    private String value;
    private String label;
    private String quantity;
    private String productName;
    private String productCode;
    private String poId;
    private String testCode;

    // ── Constructors ──────────────────────────────────────────────────────

    public DropDownResponse(String value, String label) {
        this.value = value;
        this.label = label;
    }

    public DropDownResponse(Long value, String label) {
        this.value = value != null ? value.toString() : null;
        this.label = label;
    }

    public DropDownResponse(Integer value, String label) {
        this.value = value != null ? value.toString() : null;
        this.label = label;
    }

    // ── With quantity ─────────────────────────────────────────────────────
    public DropDownResponse(Long value, String label,
            String quantity) {
        this.value    = value != null ? value.toString() : null;
        this.label    = label;
        this.quantity = quantity;
    }

    // ── With quantity, poId, productName, productCode ─────────────────────
    public DropDownResponse(Long value, String label,
            String quantity, String poId,
            String productName, String productCode) {
        this.value       = value != null ? value.toString() : null;
        this.label       = label;
        this.quantity    = quantity;
        this.poId        = poId;
        this.productName = productName;
        this.productCode = productCode;
    }

    // ── With testCode ─────────────────────────────────────────────────────
    public DropDownResponse(Long value, String label,
            String quantity, String testCode,
            boolean isTestCode) {
        this.value    = value != null ? value.toString() : null;
        this.label    = label;
        this.quantity = quantity;
        this.testCode = testCode;
    }

    // ── Getters and Setters ───────────────────────────────────────────────
    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }

    public String getQuantity() { return quantity; }
    public void setQuantity(String quantity) { this.quantity = quantity; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductCode() { return productCode; }
    public void setProductCode(String productCode) { this.productCode = productCode; }

    public String getPoId() { return poId; }
    public void setPoId(String poId) { this.poId = poId; }

    public String getTestCode() { return testCode; }
    public void setTestCode(String testCode) { this.testCode = testCode; }
}