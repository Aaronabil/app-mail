package com.aplikasiberkas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuratMasukRequest {
    private String nomorSurat;
    private LocalDate tanggal;
    private String pengirim;
    private String perihal;
    private String isiSingkat;
    private String status;
}
