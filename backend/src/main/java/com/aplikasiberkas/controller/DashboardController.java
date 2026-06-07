package com.aplikasiberkas.controller;

import com.aplikasiberkas.dto.DashboardStats;
import com.aplikasiberkas.dto.MonthlyChartData;
import com.aplikasiberkas.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    public ResponseEntity<DashboardStats> getStats() {
        return ResponseEntity.ok(dashboardService.getStats());
    }

    @GetMapping("/chart/monthly")
    public ResponseEntity<MonthlyChartData> getMonthlyChartData() {
        return ResponseEntity.ok(dashboardService.getMonthlyChartData());
    }
}
