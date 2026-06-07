package com.aplikasiberkas.controller;

import com.aplikasiberkas.service.PdfService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pdf")
@RequiredArgsConstructor
public class PdfController {

    private final PdfService pdfService;

    @GetMapping("/surat-masuk/{id}")
    public ResponseEntity<byte[]> exportSuratMasuk(@PathVariable Long id) {
        try {
            byte[] pdf = pdfService.generateSuratMasukPdf(id);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "surat-masuk-" + id + ".pdf");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/surat-keluar/{id}")
    public ResponseEntity<byte[]> exportSuratKeluar(@PathVariable Long id) {
        try {
            byte[] pdf = pdfService.generateSuratKeluarPdf(id);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "surat-keluar-" + id + ".pdf");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/surat-masuk/batch")
    public ResponseEntity<byte[]> exportSuratMasukBatch(@RequestBody(required = false) List<Long> ids) {
        try {
            byte[] pdf = pdfService.generateSuratMasukListPdf(ids);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "surat-masuk-list.pdf");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/surat-keluar/batch")
    public ResponseEntity<byte[]> exportSuratKeluarBatch(@RequestBody(required = false) List<Long> ids) {
        try {
            byte[] pdf = pdfService.generateSuratKeluarListPdf(ids);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_PDF);
            headers.setContentDispositionFormData("attachment", "surat-keluar-list.pdf");
            
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(pdf);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }
}
