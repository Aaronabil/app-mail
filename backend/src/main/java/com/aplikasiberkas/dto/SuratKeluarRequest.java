package com.aplikasiberkas.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SuratKeluarRequest {
    private String nomorSurat;
    private LocalDate tanggal;
    private String penerima;
    private String perihal;
    private String isiSingkat;
    private String status;
}
