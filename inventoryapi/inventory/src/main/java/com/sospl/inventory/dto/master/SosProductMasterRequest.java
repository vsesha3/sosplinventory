package com.sospl.inventory.dto.master;

import java.util.List;

import com.sospl.inventory.model.inventory.master.SosProductMaster;
import com.sospl.inventory.model.master.SosProdMasterPmDetls;
import com.sospl.inventory.model.master.SosProdMasterRmDetls;


public class SosProductMasterRequest extends SosProductMaster {

	
	
	
	List<SosProdMasterRmDetls> rmDetails;
	List<SosProdMasterPmDetls> pmDetails;
	
	public List<SosProdMasterRmDetls> getRmDetails() {
		return rmDetails;
	}
	public void setRmDetails(List<SosProdMasterRmDetls> rmDetails) {
		this.rmDetails = rmDetails;
	}
	public List<SosProdMasterPmDetls> getPmDetails() {
		return pmDetails;
	}
	public void setPmDetails(List<SosProdMasterPmDetls> pmDetails) {
		this.pmDetails = pmDetails;
	}
	
	
	
	
}
