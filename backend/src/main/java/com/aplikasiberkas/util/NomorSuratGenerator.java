package com.aplikasiberkas.util;

import org.springframework.stereotype.Component;

import java.time.Year;
import java.util.concurrent.atomic.AtomicInteger;

@Component
public class NomorSuratGenerator {

    private final AtomicInteger counterMasuk = new AtomicInteger(1);
    private final AtomicInteger counterKeluar = new AtomicInteger(1);

    public String generateNomorSuratMasuk() {
        int year = Year.now().getValue();
        int number = counterMasuk.getAndIncrement();
        return String.format("%03d/SM/%d", number, year);
    }

    public String generateNomorSuratKeluar() {
        int year = Year.now().getValue();
        int number = counterKeluar.getAndIncrement();
        return String.format("%03d/SK/%d", number, year);
    }
}
