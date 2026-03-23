package com.sospl.inventory.dto.common;

public class PoItemDropDownResponse {

    private String code;       // rm_code, pm_code, cg_code, misc_code
    private String name;       // rm_name, pm_name, cg_name, misc_name
    private String poType;     // RAW_MATERIAL, PACKING_MATERIAL etc

    public PoItemDropDownResponse(String code, String name, String poType) {
        this.code   = code != null ? code : "-";
        this.name   = name != null ? name : "-";
        this.poType = poType;
    }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getPoType() { return poType; }
    public void setPoType(String poType) { this.poType = poType; }
}