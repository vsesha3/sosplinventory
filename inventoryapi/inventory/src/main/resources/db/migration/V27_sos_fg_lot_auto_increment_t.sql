CREATE TABLE IF NOT EXISTS sos_fg_lot_auto_increment_t
(
    lot_id              BIGINT AUTO_INCREMENT PRIMARY KEY,
    product_fg_lot_code VARCHAR(100)         NULL,
    year                VARCHAR(4)           NULL,
    fg_auto             BIGINT DEFAULT 0     NULL,
    created_at          DATETIME             NULL,
    updated_at          DATETIME             NULL
);