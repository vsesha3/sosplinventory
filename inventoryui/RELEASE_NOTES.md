# Release Notes

## Unreleased

### Sales Order (new / edit)
- New mandatory **Requested By** field (user dropdown), next to Partial PO.
- **Company** list now comes from the company master instead of a fixed list, and a new company can be added with the **+** button next to it. The new company is selected automatically once saved.

### Production Plan (new / edit)
- **Vessels** list now comes from the vessel master, and a new vessel can be added with the **+** button next to it. The new vessel is selected automatically once saved.
- When editing a plan, **Work Order Code** now shows the plan's work order and can't be changed. When adding a plan, the work order list is still based on the From / To dates.

### Work Order (new / edit)
- A new **Plant** can be added from the work order form using the **+** button next to the Plant dropdown. The new plant is selected automatically once saved.
- Fields re-ordered: Work Order ID, Product, Plant, WO Code, Line Item, UOM, PM, Quantity, Average Rate.
- **UOM** and **PM (Packing Material)** are now filled from the selected product and can't be edited. PM lists every packing material associated with the product. Both stay disabled until a product is chosen.
- **Per Unit Rate** renamed to **Average Rate** and is no longer mandatory.

## Version 1.0.0 — 02-10-2026

### Material Inward — list page
- **PO No / Inward Type** merged into one column, e.g. `RM/0001/2026-2027-BY PO`; job inwards without a PO show `JOB INWARD`.
- **Invoice Date** now shown as DD-MM-YYYY.
- **Supplier** now shows for every receipt, including job inwards (taken from the receipt's own supplier).
- **SGST / CGST / IGST amounts** are now calculated from the received quantity × rate × GST %. Only the applicable tax is shown (IGST, or SGST + CGST); the others show `—`.
- **Total Amount** now includes the taxes.

### Material Inward — expanded RM details
- **RM Name and UOM** now show for job-inward lines.
- SGST % / CGST % / IGST % replaced by a single **GST %** column, e.g. `IGST 18.00` or `SGST 9.00 + CGST 9.00`.

### Job Inward entry
- GST % (SGST/CGST or IGST) can now be entered on job-inward lines, with the tax summary shown as for PO lines.
- GST % is now stored per receipt line for both By-PO and job-inward receipts.

### Login screen
- Shows the application version and release date.

### Deployment notes
- **Database change required before deploying the backend:** run `V29__add_gst_to_sos_material_receipt_t.sql` (adds `sgst`, `cgst`, `igst` to `sos_material_receipt_t`). Flyway is disabled, so run it manually on each environment.

### Known limitations
- Job-inward receipts saved before this release have no GST stored; they show no tax until edited and saved again.
- Summary amounts use the whole-number received count, so fractional quantities (e.g. 12.5) are understated.
