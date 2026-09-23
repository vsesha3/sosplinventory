package com.sospl.inventory.util;

public enum SosMaterialType {

    RM("RAW_MATERIAL",      "Raw Material"),
    PM("PACKING_MATERIAL",  "Packing Material"),
    MI("MISCELLANEOUS",     "Miscellaneous Items");

    private final String code;
    private final String displayName;

    SosMaterialType(String code, String displayName) {
        this.code        = code;
        this.displayName = displayName;
    }

    public String getCode() { return code; }
    public String getDisplayName() { return displayName; }

    // ── Get by code ───────────────────────────────────────────────────
    public static SosMaterialType fromCode(String code) {
        for (SosMaterialType type : values()) {
            if (type.code.equalsIgnoreCase(code)) {
                return type;
            }
        }
        throw new IllegalArgumentException(
                "Unknown material type code: " + code);
    }
}