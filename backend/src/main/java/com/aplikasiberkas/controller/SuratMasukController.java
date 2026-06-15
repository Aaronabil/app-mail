package com.aplikasiberkas.controller;

import com.aplikasiberkas.dto.SuratMasukRequest;
import com.aplikasiberkas.dto.SuratMasukResponse;
import com.aplikasiberkas.entity.SuratMasuk;
import com.aplikasiberkas.entity.User;
import com.aplikasiberkas.service.AuthService;
import com.aplikasiberkas.service.FileStorageService;
import com.aplikasiberkas.service.SuratMasukService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.nio.file.Paths;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/surat-masuk")
@RequiredArgsConstructor
public class SuratMasukController {

    private final SuratMasukService service;
    private final AuthService authService;
    private final FileStorageService fileStorageService;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "tanggal") String sortBy,
            @RequestParam(required = false, defaultValue = "DESC") String sortDir,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size) {
        
        return ResponseEntity.ok(service.getAll(status, startDate, endDate, search, sortBy, sortDir, page, size));
    }

    @GetMapping("/{id}")
    public ResponseEntity<SuratMasukResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/{id}/file")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long id) {
        SuratMasuk surat = service.getEntityById(id);
        if (surat.getFilePath() == null || surat.getFilePath().isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = fileStorageService.loadFileAsResource(surat.getFilePath());
        String fileName = surat.getNamaFile() != null ? surat.getNamaFile()
                : Paths.get(surat.getFilePath()).getFileName().toString();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @PostMapping(consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<SuratMasukResponse> create(
            @RequestPart("request") SuratMasukRequest request,
            @RequestPart(value = "file", required = false) org.springframework.web.multipart.MultipartFile file,
            Authentication authentication) {
        
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(service.create(request, file, user));
    }

    @PutMapping(path = "/{id}", consumes = { org.springframework.http.MediaType.MULTIPART_FORM_DATA_VALUE })
    public ResponseEntity<SuratMasukResponse> update(
            @PathVariable Long id,
            @RequestPart("request") SuratMasukRequest request,
            @RequestPart(value = "file", required = false) org.springframework.web.multipart.MultipartFile file) {
        
        return ResponseEntity.ok(service.update(id, request, file));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/batch-delete")
    public ResponseEntity<Void> batchDelete(@RequestBody List<Long> ids) {
        service.batchDelete(ids);
        return ResponseEntity.noContent().build();
    }
}
