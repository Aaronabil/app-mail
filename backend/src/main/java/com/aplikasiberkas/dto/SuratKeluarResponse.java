package com.aplikasiberkas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuratKeluarResponse {
    private Long id;
    private String nomorSurat;
    private LocalDate tanggal;
    private String penerima;
    private String perihal;
    private String isiSingkat;
    private String status;
    private String filePath;
    private String createdByUsername;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
