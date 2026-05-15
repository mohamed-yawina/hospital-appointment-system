package com.example.hospital;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HospitalApplication {
	public static void main(String[] args) {
		SpringApplication.run(HospitalApplication.class, args);
		System.out.println("🚀 Hospital Backend Started!");
		System.out.println("📝 API available at: http://localhost:8080/api");
	}
}