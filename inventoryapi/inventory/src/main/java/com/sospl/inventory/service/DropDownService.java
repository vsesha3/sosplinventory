package com.sospl.inventory.service;

import com.sospl.inventory.dto.common.DropDownResponse;

import java.util.List;

public interface DropDownService {

    List<DropDownResponse> getDropdown(String type);
}