package com.sospl.inventory.service.inventory.view;

import com.sospl.inventory.dto.inventory.view.SosPoDetailsResponse;

import java.util.List;

public interface SosPoDetailsService {

    List<SosPoDetailsResponse> findByPoRefNo(Long poRefNo);
}