package com.sospl.inventory.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class SchemaConfig {

    @Value("${app.schema.attendance}")
    private String attendanceSchema;

    public String getAttendanceSchema() { return attendanceSchema; }
}