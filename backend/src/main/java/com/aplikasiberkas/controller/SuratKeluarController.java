package com.aplikasiberkas.controller;

import com.aplikasiberkas.dto.SuratKeluarRequest;
import com.aplikasiberkas.dto.SuratKeluarResponse;
import com.aplikasiberkas.entity.User;
import com.aplikasiberkas.service.AuthService;
import com.aplikasiberkas.service.SuratKeluarService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.nio.file.Paths;

@RestController
@RequestMapping("/surat-keluar")
@RequiredArgsConstructor
public class SuratKeluarController {

    private final SuratKeluarService service;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<SuratKeluarResponse>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "tanggal") String sortBy,
            @RequestParam(required = false, defaultValue = "DESC") String sortDir) {
        
        List<SuratKeluarResponse> result = service.getAll(status, startDate, endDate, search, sortBy, sortDir);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SuratKeluarResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<SuratKeluarResponse> create(
            @RequestBody SuratKeluarRequest request,
            Authentication authentication) {
        
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(service.create(request, user));
    }

    @PostMapping(path = "/{id}/attachment", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<SuratKeluarResponse> uploadAttachment(
            @PathVariable Long id,
            @RequestPart("file") MultipartFile file) {
        return ResponseEntity.ok(service.uploadAttachment(id, file));
    }

    @GetMapping("/{id}/attachment")
    public ResponseEntity<Resource> downloadAttachment(@PathVariable Long id) {
        SuratKeluarResponse surat = service.getById(id);
        if (surat.getFilePath() == null || surat.getFilePath().isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Resource resource = service.loadAttachment(surat.getFilePath());
        String fileName = Paths.get(surat.getFilePath()).getFileName().toString();
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .body(resource);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuratKeluarResponse> update(
            @PathVariable Long id,
            @RequestBody SuratKeluarRequest request) {
        
        return ResponseEntity.ok(service.update(id, request));
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
