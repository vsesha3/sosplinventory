package com.sospl.inventory;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

@SpringBootApplication
public class SosplinventoryApplication {

	public static void main(String[] args) {
		
		 BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
	        String raw = "Admin@123";
	        String hash = encoder.encode(raw);
	        System.out.println("=== NEW HASH ===");
	        System.out.println("Hash  : " + hash);
	        System.out.println("Match : " + encoder.matches(raw, hash));
	        System.out.println("================");
		SpringApplication.run(SosplinventoryApplication.class, args);
	}

}
