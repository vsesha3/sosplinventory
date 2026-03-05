package com.sospl.inventory.service.inventory.master.impl;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sospl.inventory.model.inventory.master.SosTestMaster;
import com.sospl.inventory.service.common.impl.BaseMasterServiceImpl;
import com.sospl.inventory.service.inventory.master.SosTestMasterService;

public class SosTestMasterServiceImpl extends BaseMasterServiceImpl<SosTestMaster,Long> implements SosTestMasterService  {

	protected SosTestMasterServiceImpl(JpaRepository<SosTestMaster, Long> repository) {
		super(repository);
		// TODO Auto-generated constructor stub
	}
	
	

}
