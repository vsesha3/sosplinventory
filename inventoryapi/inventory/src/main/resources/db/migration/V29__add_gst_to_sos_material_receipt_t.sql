-- GST % per receipt line (job inward lines have no PO line to hold the tax)
ALTER TABLE sos_material_receipt_t
    ADD COLUMN sgst DECIMAL(5,2) NULL,
    ADD COLUMN cgst DECIMAL(5,2) NULL,
    ADD COLUMN igst DECIMAL(5,2) NULL;
