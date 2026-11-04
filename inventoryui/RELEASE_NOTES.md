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

### Material Request (new / edit)

**Picking stock lot by lot**
- Click a raw material in **RM Mapping** and its stock opens in a popup, **RM Stock Lot Wise Selection**. It used to show at the side of the screen.
- The popup lists every lot of that raw material: Lot No, GRN No, Total Qty, Issued Qty, Remaining Qty, Receipt Date and Invoice No.
- Type the quantity to give out from each lot in the new **Issue Qty** column, then press **Save**.
- Below the table you can see the **Required Qty**, the **Total Issue Qty** you have entered, and the **Balance to Issue**.
- If there is only one lot, Issue Qty is filled in for you.
- All quantities now show 2 decimal places (for example 25.50) instead of 3.

**Checks when you save**
- You can't issue more than a lot's **Remaining Qty**. The box turns red if you try.
- The total you issue can't be more than what is still needed for that raw material.
- Lots with no stock left can't be selected.

**When the issue is recorded**
- **New request:** the quantities you enter are recorded when you press **Save Request**.
- **Editing a saved request:** the issue is recorded as soon as you press **Save** in the popup. A green message confirms it with the issue number.
- If something goes wrong, you'll see a message saying which raw materials were not issued. The request itself is still saved.

**RM Mapping table**
- New **Issue Qty** column: how much has been issued for each raw material. It turns green when the full required quantity is issued.
- New **Balance** column: how much is still left to issue.
- When you edit a saved request, RM Mapping shows the raw materials saved on that request. The popup also shows how much is **Already Issued**.
- If you change the **Request Quantity**, the required quantities are worked out again from the product.

### Known limitations
- **Issue Shift** and **Received By** can't be entered yet.
- The quantity already issued on a saved request will show once the matching server update is released. Until then, only issues made while the form is open are counted.

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
