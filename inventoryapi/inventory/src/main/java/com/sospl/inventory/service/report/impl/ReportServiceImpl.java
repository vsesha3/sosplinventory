package com.sospl.inventory.service.report.impl;

import com.sospl.inventory.service.report.ReportService;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperExportManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;
import net.sf.jasperreports.export.SimpleXlsxReportConfiguration;
import net.sf.jasperreports.engine.export.ooxml.JRXlsxExporter; // ← correct package
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.io.ByteArrayOutputStream;
import java.io.InputStream;
import java.sql.Connection;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class ReportServiceImpl implements ReportService {

	private static final Logger log = LoggerFactory.getLogger(ReportServiceImpl.class);

	private final DataSource dataSource;

	public ReportServiceImpl(DataSource dataSource) {
		this.dataSource = dataSource;
	}

	@Override
	public byte[] generatePdf(String templatePath, Map<String, Object> params) throws Exception {
		JasperPrint jasperPrint = getJasperPrint(templatePath, params);
		System.out.println("from here");
		return JasperExportManager.exportReportToPdf(jasperPrint);
	}

	@Override
	public byte[] generateExcel(String templatePath, Map<String, Object> params) throws Exception {
		JasperPrint jasperPrint = getJasperPrint(templatePath, params);

		ByteArrayOutputStream outputStream = new ByteArrayOutputStream();

		JRXlsxExporter exporter = new JRXlsxExporter();
		exporter.setExporterInput(new SimpleExporterInput(jasperPrint));
		exporter.setExporterOutput(new SimpleOutputStreamExporterOutput(outputStream));

		SimpleXlsxReportConfiguration config = new SimpleXlsxReportConfiguration();
		config.setOnePagePerSheet(false);
		config.setDetectCellType(true);
		config.setCollapseRowSpan(false);
		exporter.setConfiguration(config);

		exporter.exportReport();
		return outputStream.toByteArray();
	}

	private JasperPrint getJasperPrint(String templatePath, Map<String, Object> params) throws Exception {

// Step 1 — Load template file
		ClassPathResource resource = new ClassPathResource(templatePath);
		if (!resource.exists()) {
			throw new RuntimeException("Report template not found: " + templatePath);
		}
		log.error("Step 1 — Template found: {}", templatePath);

// Step 2 — Read input stream
		InputStream inputStream = null;
		try {
			inputStream = resource.getInputStream();
			log.error("Step 2 — Input stream opened successfully");
		} catch (Exception e) {
			log.error("Step 2 FAILED — Cannot read template: {}", e.getMessage());
			throw new RuntimeException("Cannot read report template: " + e.getMessage(), e);
		}

// Step 3 — Compile JRXML
		JasperReport jasperReport = null;
		try {
			jasperReport = JasperCompileManager.compileReport(inputStream);
			log.error("Step 3 — JRXML compiled successfully");
		} catch (Exception e) {
			log.error("Step 3 FAILED — JRXML compile error: {}", e.getMessage());
			throw new RuntimeException("JRXML compile error: " + e.getMessage(), e);
		}

// Step 4 — Get DB connection
		Connection connection = null;
		try {
			connection = dataSource.getConnection();
			log.error("Step 4 — DB connection obtained successfully");
		} catch (Exception e) {
			log.error("Step 4 FAILED — Cannot get DB connection: {}", e.getMessage());
			throw new RuntimeException("Cannot get DB connection: " + e.getMessage(), e);
		}

// Step 5 — Fill report with data
		try {
			log.error("Step 5 — Filling report with params: {}", params);
			JasperPrint jasperPrint = JasperFillManager.fillReport(jasperReport, params, connection);
			log.error("Step 5 — Report filled successfully");
			return jasperPrint;
		} catch (Exception e) {
			log.error("Step 5 FAILED — Report fill error: {}", e.getMessage(), e);
			throw new RuntimeException("Report fill error: " + e.getMessage(), e);
		} finally {
// Always close connection
			if (connection != null) {
				try {
					connection.close();
					log.error("Step 5 — DB connection closed");
				} catch (Exception e) {
					log.error("Cannot close DB connection: {}", e.getMessage());
				}
			}
		}
	}
}