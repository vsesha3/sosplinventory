package com.sospl.inventory.repository.inventory;

import com.sospl.inventory.model.inventory.SosRmStockFifoView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SosRmStockFifoViewRepository
        extends JpaRepository<SosRmStockFifoView, Long> {

    // Get all FIFO stock
    List<SosRmStockFifoView> findAllByOrderByReceiptDateAsc();

    // Get by rm_id — FIFO
    List<SosRmStockFifoView> findAllByRmIdOrderByReceiptDateAsc(
            Long rmId);

    // Get by rm_code — FIFO
    List<SosRmStockFifoView> findAllByRmCodeOrderByReceiptDateAsc(
            Long rmCode);

    // Get by lot_no
    List<SosRmStockFifoView> findAllByLotNo(String lotNo);
    
    
    @Query(value = """
    	       SELECT
    	           receiptId,
    	           invoiceNo,
    	           issuedQty,
    	           lotNo,
    	           perUnitRate,
    	           receiptDate,
    	           receiptDetId,
    	           rmCode,
    	           rmId,
    	           rmName,
    	           supplierId,
    	           totalQty,
    	           remainingQty,
    	           grnNo
    	       FROM sos_rm_stock_fifo_v
    	       WHERE rmCode = :rmCode
    	       ORDER BY receiptDate ASC
    	       """, nativeQuery = true)
    	List<Object[]> findAllFifoStockByRmCode(
    	        @Param("rmCode") Long rmCode);

    	// ── All stock ─────────────────────────────────────────────────────────────
    	@Query(value = """
    	       SELECT
    	           receiptId,
    	           invoiceNo,
    	           issuedQty,
    	           lotNo,
    	           perUnitRate,
    	           receiptDate,
    	           receiptDetId,
    	           rmCode,
    	           rmId,
    	           rmName,
    	           supplierId,
    	           totalQty,
    	           remainingQty,
    	           grnNo
    	       FROM sos_rm_stock_fifo_v
    	       ORDER BY receiptId DESC
    	       """, nativeQuery = true)
    	List<Object[]> findAllFifoStock();

    	// ── By rmId ───────────────────────────────────────────────────────────────
    	@Query(value = """
    	       SELECT
    	           receiptId,
    	           invoiceNo,
    	           issuedQty,
    	           lotNo,
    	           perUnitRate,
    	           receiptDate,
    	           receiptDetId,
    	           rmCode,
    	           rmId,
    	           rmName,
    	           supplierId,
    	           totalQty,
    	           remainingQty,
    	           grnNo
    	       FROM sos_rm_stock_fifo_v
    	       WHERE rmId = :rmId
    	       ORDER BY receiptDate ASC
    	       """, nativeQuery = true)
    	List<Object[]> findAllFifoStockByRmId(
    	        @Param("rmId") Long rmId);
}