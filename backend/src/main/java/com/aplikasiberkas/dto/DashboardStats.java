package com.aplikasiberkas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStats {
    private long totalSuratMasuk;
    private long totalSuratKeluar;
    private long suratMasukReceived;
    private long suratMasukArchived;
    private long suratKeluarDraft;
    private long suratKeluarSent;
    private long suratKeluarArchived;
}
