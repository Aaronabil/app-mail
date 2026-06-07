package com.aplikasiberkas.controller;

import com.aplikasiberkas.dto.SuratMasukRequest;
import com.aplikasiberkas.dto.SuratMasukResponse;
import com.aplikasiberkas.entity.User;
import com.aplikasiberkas.service.AuthService;
import com.aplikasiberkas.service.SuratMasukService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/surat-masuk")
@RequiredArgsConstructor
public class SuratMasukController {

    private final SuratMasukService service;
    private final AuthService authService;

    @GetMapping
    public ResponseEntity<List<SuratMasukResponse>> getAll(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(required = false) String search,
            @RequestParam(required = false, defaultValue = "tanggal") String sortBy,
            @RequestParam(required = false, defaultValue = "DESC") String sortDir) {
        
        List<SuratMasukResponse> result = service.getAll(status, startDate, endDate, search, sortBy, sortDir);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SuratMasukResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @PostMapping
    public ResponseEntity<SuratMasukResponse> create(
            @RequestBody SuratMasukRequest request,
            Authentication authentication) {
        
        User user = authService.getCurrentUser(authentication.getName());
        return ResponseEntity.ok(service.create(request, user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SuratMasukResponse> update(
            @PathVariable Long id,
            @RequestBody SuratMasukRequest request) {
        
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
