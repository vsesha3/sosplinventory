package com.sospl.inventory.util;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

public class WoCodeGenerator {

    private WoCodeGenerator() {}

    // ── Generate WO code ──────────────────────────────────────────────────
    public static String generate(String productName) {
        String productAbbr = generateProductAbbr(productName);
        String timestamp = LocalDateTime.now()
                .format(DateTimeFormatter.ofPattern(
                        "yyyyMMddHHmmss"));
        return "WO-" + productAbbr + "-" + timestamp;
    }

    // ── Generate abbreviation from product name ───────────────────────────
    // Example: "Sodium Chloride" → "SCh"
    private static String generateProductAbbr(String productName) {
        if (productName == null || productName.isBlank())
            return "NA";

        String[] parts = productName.trim().split("\\s+");

        if (parts.length == 1) {
            // Single word — take first 3 letters
            return parts[0].substring(0,
                    Math.min(3, parts[0].length()))
                    .toUpperCase();
        }

        // First letter of first word
        String firstLetter = String.valueOf(
                parts[0].charAt(0)).toUpperCase();

        // First two letters of second word
        String secondPart = parts[1].length() >= 2
                ? parts[1].substring(0, 2)
                : parts[1];

        return firstLetter + secondPart.toUpperCase();
    }
}