package com.sospl.inventory.dto.common;

public class DropDownResponse {

    private String value;  // id field  — always String for flexibility
    private String label;
    private long  pmId;// name field — displayed in UI

    public long getPmId() {
		return pmId;
	}

	public void setPmId(long pmId) {
		this.pmId = pmId;
	}

	public DropDownResponse(String value, String label) {
        this.value = value;
        this.label = label;
        
        
    }

    // For Long value (supplier_id, customer_id etc)
    public DropDownResponse(Long value, String label) {
        this.value = value != null ? value.toString() : null;
        this.label = label;
    }

    // For Integer value (uom_id, group_id etc)
    public DropDownResponse(Integer value, String label) {
        this.value = value != null ? value.toString() : null;
        this.label = label;
    }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
}