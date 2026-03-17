package com.sospl.inventory.dto.inventory.master;

import java.math.BigDecimal;

public class SosRmMasterResponse {

    private Integer rmId;
    private Long rmCode;
    private String rmName;
    private String uomName;
    private String rmGroupName;
    private String testName;
    private BigDecimal avgRate;

    // New fields for active with pack details
    private Long uomId;
    private Long packUom;
    private String packUomName;
    private BigDecimal packSize;

    // ── Constructor 1a — Integer rmId, Long rmCode (7 fields) ────────────
    public SosRmMasterResponse(
            Integer rmId,
            Long rmCode,
            String rmName,
            String uomName,
            String rmGroupName,
            String testName,
            BigDecimal avgRate
    ) {
        this.rmId        = rmId;
        this.rmCode      = rmCode;
        this.rmName      = rmName != null ? rmName : "-";
        this.uomName     = uomName != null ? uomName : "-";
        this.rmGroupName = rmGroupName != null ? rmGroupName : "-";
        this.testName    = testName != null ? testName : "-";
        this.avgRate     = avgRate;
    }

    // ── Constructor 1b — Long rmId, Long rmCode (7 fields) ───────────────
    public SosRmMasterResponse(
            Long rmId,
            Long rmCode,
            String rmName,
            String uomName,
            String rmGroupName,
            String testName,
            BigDecimal avgRate
    ) {
        this.rmId        = rmId != null ? rmId.intValue() : null;
        this.rmCode      = rmCode;
        this.rmName      = rmName != null ? rmName : "-";
        this.uomName     = uomName != null ? uomName : "-";
        this.rmGroupName = rmGroupName != null ? rmGroupName : "-";
        this.testName    = testName != null ? testName : "-";
        this.avgRate     = avgRate;
    }

    // ── Constructor 1c — Integer rmId, Integer rmCode (7 fields) ─────────
    public SosRmMasterResponse(
            Integer rmId,
            Integer rmCode,
            String rmName,
            String uomName,
            String rmGroupName,
            String testName,
            BigDecimal avgRate
    ) {
        this.rmId        = rmId;
        this.rmCode      = rmCode != null ? rmCode.longValue() : null;
        this.rmName      = rmName != null ? rmName : "-";
        this.uomName     = uomName != null ? uomName : "-";
        this.rmGroupName = rmGroupName != null ? rmGroupName : "-";
        this.testName    = testName != null ? testName : "-";
        this.avgRate     = avgRate;
    }

    // ── Constructor 2a — Integer rmId, Long uomId, Long packUom (9 fields)
    public SosRmMasterResponse(
            Integer rmId,
            Long rmCode,
            String rmName,
            Long uomId,
            String uomName,
            Long packUom,
            String packUomName,
            BigDecimal avgRate,
            BigDecimal packSize
    ) {
        this.rmId        = rmId;
        this.rmCode      = rmCode;
        this.rmName      = rmName != null ? rmName : "-";
        this.uomId       = uomId;
        this.uomName     = uomName != null ? uomName : "-";
        this.packUom     = packUom;
        this.packUomName = packUomName != null ? packUomName : "-";
        this.avgRate     = avgRate;
        this.packSize    = packSize;
    }

    // ── Constructor 2b — Long rmId, Long uomId, Long packUom (9 fields) ──
    public SosRmMasterResponse(
            Long rmId,
            Long rmCode,
            String rmName,
            Long uomId,
            String uomName,
            Long packUom,
            String packUomName,
            BigDecimal avgRate,
            BigDecimal packSize
    ) {
        this.rmId        = rmId != null ? rmId.intValue() : null;
        this.rmCode      = rmCode;
        this.rmName      = rmName != null ? rmName : "-";
        this.uomId       = uomId;
        this.uomName     = uomName != null ? uomName : "-";
        this.packUom     = packUom;
        this.packUomName = packUomName != null ? packUomName : "-";
        this.avgRate     = avgRate;
        this.packSize    = packSize;
    }

    // ── Constructor 2c — Integer rmId, Integer uomId, Integer packUom ────
    public SosRmMasterResponse(
            Integer rmId,
            Long rmCode,
            String rmName,
            Integer uomId,
            String uomName,
            Integer packUom,
            String packUomName,
            BigDecimal avgRate,
            BigDecimal packSize
    ) {
        this.rmId        = rmId;
        this.rmCode      = rmCode;
        this.rmName      = rmName != null ? rmName : "-";
        this.uomId       = uomId != null ? uomId.longValue() : null;
        this.uomName     = uomName != null ? uomName : "-";
        this.packUom     = packUom != null ? packUom.longValue() : null;
        this.packUomName = packUomName != null ? packUomName : "-";
        this.avgRate     = avgRate;
        this.packSize    = packSize;
    }

    // ── Getters and Setters ───────────────────────────────────────────────

    public Integer getRmId() { return rmId; }
    public void setRmId(Integer rmId) { this.rmId = rmId; }

    public Long getRmCode() { return rmCode; }
    public void setRmCode(Long rmCode) { this.rmCode = rmCode; }

    public String getRmName() { return rmName; }
    public void setRmName(String rmName) { this.rmName = rmName; }

    public String getUomName() { return uomName; }
    public void setUomName(String uomName) { this.uomName = uomName; }

    public String getRmGroupName() { return rmGroupName; }
    public void setRmGroupName(String rmGroupName) { this.rmGroupName = rmGroupName; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public BigDecimal getAvgRate() { return avgRate; }
    public void setAvgRate(BigDecimal avgRate) { this.avgRate = avgRate; }

    public Long getUomId() { return uomId; }
    public void setUomId(Long uomId) { this.uomId = uomId; }

    public Long getPackUom() { return packUom; }
    public void setPackUom(Long packUom) { this.packUom = packUom; }

    public String getPackUomName() { return packUomName; }
    public void setPackUomName(String packUomName) { this.packUomName = packUomName; }

    public BigDecimal getPackSize() { return packSize; }
    public void setPackSize(BigDecimal packSize) { this.packSize = packSize; }
}