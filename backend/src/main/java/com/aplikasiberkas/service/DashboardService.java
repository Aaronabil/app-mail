package com.aplikasiberkas.service;

import com.aplikasiberkas.dto.DashboardStats;
import com.aplikasiberkas.dto.MonthlyChartData;
import com.aplikasiberkas.entity.SuratKeluar;
import com.aplikasiberkas.entity.SuratMasuk;
import com.aplikasiberkas.repository.SuratKeluarRepository;
import com.aplikasiberkas.repository.SuratMasukRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final SuratMasukRepository suratMasukRepository;
    private final SuratKeluarRepository suratKeluarRepository;

    public DashboardStats getStats() {
        DashboardStats stats = new DashboardStats();
        
        stats.setTotalSuratMasuk(suratMasukRepository.count());
        stats.setTotalSuratKeluar(suratKeluarRepository.count());
        
        stats.setSuratMasukReceived(suratMasukRepository.countByStatus("RECEIVED"));
        stats.setSuratMasukArchived(suratMasukRepository.countByStatus("ARCHIVED"));
        
        stats.setSuratKeluarDraft(suratKeluarRepository.countByStatus("DRAFT"));
        stats.setSuratKeluarSent(suratKeluarRepository.countByStatus("SENT"));
        stats.setSuratKeluarArchived(suratKeluarRepository.countByStatus("ARCHIVED"));
        
        return stats;
    }

    public MonthlyChartData getMonthlyChartData() {
        int currentYear = LocalDate.now().getYear();
        int currentMonth = LocalDate.now().getMonthValue();

        boolean isFirstHalf = currentMonth <= 6;
        int startMonth = isFirstHalf ? 1 : 7;
        int endMonth = isFirstHalf ? 6 : 12;

        LocalDate startDate = LocalDate.of(currentYear, startMonth, 1);
        LocalDate endDate = LocalDate.of(currentYear, endMonth, endDateLength(currentYear, endMonth));

        List<SuratMasuk> suratMasukList = suratMasukRepository.findByTanggalBetween(startDate, endDate);
        List<SuratKeluar> suratKeluarList = suratKeluarRepository.findByTanggalBetween(startDate, endDate);

        Map<Integer, Long> masukByMonth = suratMasukList.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getTanggal().getMonthValue(),
                        Collectors.counting()
                ));

        Map<Integer, Long> keluarByMonth = suratKeluarList.stream()
                .collect(Collectors.groupingBy(
                        s -> s.getTanggal().getMonthValue(),
                        Collectors.counting()
                ));

        List<String> allMonthLabels = Arrays.asList("Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des");

        List<MonthlyChartData.MonthData> months = new java.util.ArrayList<>();
        for (int i = startMonth - 1; i < endMonth; i++) {
            int monthNum = i + 1;
            months.add(new MonthlyChartData.MonthData(
                    allMonthLabels.get(i),
                    masukByMonth.getOrDefault(monthNum, 0L),
                    keluarByMonth.getOrDefault(monthNum, 0L)
            ));
        }

        return new MonthlyChartData(months);
    }

    private int endDateLength(int year, int month) {
        return LocalDate.of(year, month, 1).lengthOfMonth();
    }
}
