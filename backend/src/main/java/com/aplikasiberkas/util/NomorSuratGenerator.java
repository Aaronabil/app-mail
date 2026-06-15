package com.aplikasiberkas.util;

import com.aplikasiberkas.repository.SuratKeluarRepository;
import com.aplikasiberkas.repository.SuratMasukRepository;
import org.springframework.stereotype.Component;

import java.time.Year;
import java.util.Set;
import java.util.TreeSet;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Component
public class NomorSuratGenerator {

    private final SuratMasukRepository suratMasukRepository;
    private final SuratKeluarRepository suratKeluarRepository;

    private static final Pattern SM_PATTERN = Pattern.compile("^(\\d{3})/SM/(\\d{4})$");
    private static final Pattern SK_PATTERN = Pattern.compile("^(\\d{3})/SK/(\\d{4})$");

    public NomorSuratGenerator(SuratMasukRepository suratMasukRepository,
                               SuratKeluarRepository suratKeluarRepository) {
        this.suratMasukRepository = suratMasukRepository;
        this.suratKeluarRepository = suratKeluarRepository;
    }

    public String generateNomorSuratMasuk() {
        int year = Year.now().getValue();
        return generateNextNumber(suratMasukRepository.findAll(), SM_PATTERN, "SM", year);
    }

    public String generateNomorSuratKeluar() {
        int year = Year.now().getValue();
        return generateNextNumber(suratKeluarRepository.findAll(), SK_PATTERN, "SK", year);
    }

    private String generateNextNumber(java.util.List<?> suratList, Pattern pattern, String prefix, int year) {
        Set<Integer> usedNumbers = new TreeSet<>();

        for (Object surat : suratList) {
            String nomorSurat = null;
            if (surat instanceof com.aplikasiberkas.entity.SuratMasuk sm) {
                nomorSurat = sm.getNomorSurat();
            } else if (surat instanceof com.aplikasiberkas.entity.SuratKeluar sk) {
                nomorSurat = sk.getNomorSurat();
            }

            if (nomorSurat != null) {
                Matcher matcher = pattern.matcher(nomorSurat);
                if (matcher.matches() && Integer.parseInt(matcher.group(2)) == year) {
                    usedNumbers.add(Integer.parseInt(matcher.group(1)));
                }
            }
        }

        int next = 1;
        for (int num : usedNumbers) {
            if (num == next) {
                next++;
            } else {
                break;
            }
        }

        return String.format("%03d/%s/%d", next, prefix, year);
    }
}
