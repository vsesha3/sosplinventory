package com.sospl.inventory.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public interface SosMiscService {
	
	
	List<Map<String, Object>> getWoDetails(Long planId);

}
