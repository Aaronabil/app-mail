package com.aplikasiberkas;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class AplikasiBerkasApplication {

    public static void main(String[] args) {
        SpringApplication.run(AplikasiBerkasApplication.class, args);
    }
}
