package com.sospl.inventory.service.inventory;

import com.sospl.inventory.model.inventory.SosRmStockFifoView;
import com.sospl.inventory.repository.inventory.SosRmStockFifoViewRepository;
import com.sospl.inventory.util.ParseUtil;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SosRmStockFifoService {

    private final SosRmStockFifoViewRepository repository;

    public SosRmStockFifoService(
            SosRmStockFifoViewRepository repository) {
        this.repository = repository;
    }

    // ── Get all FIFO stock ────────────────────────────────────────────────
    public List<SosRmStockFifoView> findAll() {
        return mapRows(repository.findAllFifoStock());
    }

    // ── Get by rmId — FIFO ────────────────────────────────────────────────
    public List<SosRmStockFifoView> findByRmId(Long rmId) {
        return mapRows(
                repository.findAllFifoStockByRmId(rmId));
    }

    // ── Get by rmCode — FIFO ──────────────────────────────────────────────
    public List<SosRmStockFifoView> findByRmCode(Long rmCode) {
        return mapRows(
                repository.findAllFifoStockByRmCode(rmCode));
    }

    // ── Map Object[] rows to SosRmStockFifoView ───────────────────────────
    private List<SosRmStockFifoView> mapRows(
            List<Object[]> rows) {
        return rows.stream()
                .filter(row -> row != null && row[0] != null)
                .map(row -> {
                    SosRmStockFifoView view =
                            new SosRmStockFifoView();
                    view.setReceiptId(ParseUtil.toLong(row[0]));
                    view.setInvoiceNo(ParseUtil.toString(row[1]));
                    view.setIssuedQty(ParseUtil.toBigDecimal(row[2]));
                    view.setLotNo(ParseUtil.toString(row[3]));
                    view.setPerUnitRate(ParseUtil.toBigDecimal(row[4]));
                    view.setReceiptDate(row[5] != null
                            ? ParseUtil.toLocalDateTime(row[5])
                                    .toLocalDate()
                            : null);
                    view.setReceiptDetId(ParseUtil.toLong(row[6]));
                    view.setRmCode(ParseUtil.toLong(row[7]));
                    view.setRmId(ParseUtil.toLong(row[8]));
                    view.setRmName(ParseUtil.toString(row[9]));
                    view.setSupplierId(ParseUtil.toLong(row[10]));
                    view.setTotalQty(ParseUtil.toBigDecimal(row[11]));
                    view.setRemainingQty(ParseUtil.toBigDecimal(row[12]));
                    view.setGrnNo(ParseUtil.toString(row[13]));
                    return view;
                })
                .collect(Collectors.toList());
    }
}