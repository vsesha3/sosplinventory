package com.sospl.inventory.controller.report;

import com.sospl.inventory.service.report.ReportService;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/reports")
public class ReportController {

    private final ReportService reportService;
    private static final Logger log =
            LoggerFactory.getLogger(ReportController.class);

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    
    // ── PO Report — PDF ───────────────────────────────────────────────────
    @GetMapping("/po/pdf")
    public ResponseEntity<byte[]> downloadPoPdf(
            @RequestParam String poNo) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("PO_NO", poNo);

            // Pass image path as parameter
            String logoPath = getClass().getResource(
                    "/reports/swathiLogo.jpg").toString();
            params.put("LOGO_PATH", logoPath);

            byte[] pdfBytes = reportService.generatePdf(
                    "reports/SOSPLPO.jrxml", params);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=PO_"
                            + poNo.replace("/", "_") + ".pdf")
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);
        } catch (Exception e) {
            log.error("PDF generation failed: {}", e.getMessage(), e);
            return ResponseEntity.internalServerError().build();
        }
    }
    // ── PO Report — Excel ─────────────────────────────────────────────────
    @GetMapping("/po/excel/{poNo}")
    public ResponseEntity<byte[]> downloadPoExcel(
            @PathVariable String poNo) {
        try {
            Map<String, Object> params = new HashMap<>();
            params.put("PO_NO", poNo);

            byte[] excelBytes = reportService.generateExcel(
                    "reports/SOSPLPO.jrxml", params);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=PO_" + poNo
                                    .replace("/", "_") + ".xlsx")
                    .contentType(MediaType.parseMediaType(
                            "application/vnd.openxmlformats-officedocument"
                                    + ".spreadsheetml.sheet"))
                    .body(excelBytes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ── Generic report — PDF (reuse for any template) ─────────────────────
    @PostMapping("/generate/pdf")
    public ResponseEntity<byte[]> generatePdf(
            @RequestParam String templateName,
            @RequestBody Map<String, Object> params) {
        try {
            byte[] pdfBytes = reportService.generatePdf(
                    "reports/" + templateName, params);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=" + templateName
                                    .replace(".jrxml", ".pdf"))
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfBytes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ── Generic report — Excel (reuse for any template) ───────────────────
    @PostMapping("/generate/excel")
    public ResponseEntity<byte[]> generateExcel(
            @RequestParam String templateName,
            @RequestBody Map<String, Object> params) {
        try {
            byte[] excelBytes = reportService.generateExcel(
                    "reports/" + templateName, params);

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename=" + templateName
                                    .replace(".jrxml", ".xlsx"))
                    .contentType(MediaType.parseMediaType(
                            "application/vnd.openxmlformats-officedocument"
                                    + ".spreadsheetml.sheet"))
                    .body(excelBytes);

        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}