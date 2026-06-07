package com.aplikasiberkas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MonthlyChartData {
    private List<MonthData> months;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class MonthData {
        private String month;
        private long suratMasuk;
        private long suratKeluar;
    }
}
