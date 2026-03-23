package com.sospl.inventory.service.report;

import net.sf.jasperreports.engine.JasperReport;

import java.util.Map;

public interface ReportService {

    // Generate PDF from any jasper template
    byte[] generatePdf(String templatePath,
                       Map<String, Object> params) throws Exception;

    // Generate Excel from any jasper template
    byte[] generateExcel(String templatePath,
                         Map<String, Object> params) throws Exception;
}