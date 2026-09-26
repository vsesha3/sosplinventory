package com.sospl.inventory.dto.master;

import java.util.List;

import com.sospl.inventory.model.master.SosTestMaster;
import com.sospl.inventory.model.master.SosTestParameter;

public class SosTestMasterRequest extends SosTestMaster {
	
	private List<SosTestParameter> parameters ;

	public List<SosTestParameter> getParameters() {
		return parameters;
	}

	public void setParameters(List<SosTestParameter> parameters) {
		this.parameters = parameters;
	}

}
