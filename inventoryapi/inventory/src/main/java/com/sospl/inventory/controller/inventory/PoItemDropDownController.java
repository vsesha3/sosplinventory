package com.sospl.inventory.controller.inventory;

import com.sospl.inventory.dto.auth.ApiResponse;
import com.sospl.inventory.dto.common.PoItemDropDownResponse;
import com.sospl.inventory.repository.inventory.PoItemDropDownRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/po")
public class PoItemDropDownController {

    private final PoItemDropDownRepository repository;

    public PoItemDropDownController(
            PoItemDropDownRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/dropdown")
    public ResponseEntity<ApiResponse<List<PoItemDropDownResponse>>> getDropDown(
            @RequestParam String poType) {
        return ResponseEntity.ok(
                ApiResponse.success(
                        "Items fetched successfully for type: " + poType,
                        repository.findByPoType(poType)));
    }
}