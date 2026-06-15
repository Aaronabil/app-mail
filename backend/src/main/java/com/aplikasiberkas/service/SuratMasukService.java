package com.aplikasiberkas.service;

import com.aplikasiberkas.dto.SuratMasukRequest;
import com.aplikasiberkas.dto.SuratMasukResponse;
import com.aplikasiberkas.entity.SuratMasuk;
import com.aplikasiberkas.entity.User;
import com.aplikasiberkas.repository.SuratMasukRepository;
import com.aplikasiberkas.util.NomorSuratGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuratMasukService {

    private final SuratMasukRepository repository;
    private final NomorSuratGenerator nomorSuratGenerator;
    private final AuditLogService auditLogService;
    private final FileStorageService fileStorageService;

    private String getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return auth.getName();
        }
        return "System";
    }

    @Transactional(readOnly = true)
    public Map<String, Object> getAll(String status, LocalDate startDate,
            LocalDate endDate, String search, String sortBy, String sortDir, int page, int size) {

        Specification<SuratMasuk> spec = Specification.where(null);

        if (status != null && !status.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                cb.equal(root.get("status"), status));
        }

        if (startDate != null && endDate != null) {
            spec = spec.and((root, query, cb) ->
                cb.between(root.get("tanggal"), startDate, endDate));
        }

        if (search != null && !search.isEmpty()) {
            spec = spec.and((root, query, cb) ->
                cb.or(
                    cb.like(cb.lower(root.get("nomorSurat")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("pengirim")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("perihal")), "%" + search.toLowerCase() + "%")
                ));
        }

        Sort.Direction direction = Sort.Direction.fromString(sortDir != null ? sortDir : "DESC");
        String sortField = sortBy != null ? sortBy : "nomorSurat";
        Sort sort = Sort.by(
                new Sort.Order(direction, sortField),
                new Sort.Order(direction, "id"));

        Pageable pageable = PageRequest.of(page, size, sort);
        Page<SuratMasuk> pageResult = repository.findAll(spec, pageable);

        List<SuratMasukResponse> content = pageResult.getContent().stream()
                .map(this::toResponse)
                .collect(Collectors.toList());

        Map<String, Object> response = new java.util.HashMap<>();
        response.put("content", content);
        response.put("totalElements", pageResult.getTotalElements());
        response.put("totalPages", pageResult.getTotalPages());
        response.put("currentPage", pageResult.getNumber());
        response.put("size", pageResult.getSize());

        return response;
    }

    @Transactional(readOnly = true)
    public SuratMasukResponse getById(Long id) {
        SuratMasuk surat = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Surat not found"));
        return toResponse(surat);
    }

    @Transactional(readOnly = true)
    public SuratMasuk getEntityById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Surat not found"));
    }

    @Transactional
    public SuratMasukResponse create(SuratMasukRequest request, org.springframework.web.multipart.MultipartFile file, User user) {
        SuratMasuk surat = new SuratMasuk();

        if (request.getNomorSurat() == null || request.getNomorSurat().isEmpty()) {
            surat.setNomorSurat(nomorSuratGenerator.generateNomorSuratMasuk());
        } else {
            surat.setNomorSurat(request.getNomorSurat());
        }

        surat.setTanggal(request.getTanggal());
        surat.setPengirim(request.getPengirim());
        surat.setPerihal(request.getPerihal());
        surat.setIsiSingkat(request.getIsiSingkat());
        surat.setStatus(request.getStatus() != null ? request.getStatus() : "RECEIVED");
        surat.setCreatedBy(user);

        surat = repository.save(surat);

        if (file != null && !file.isEmpty()) {
            try {
                String storagePath = fileStorageService.storeFile(file, "surat-masuk/" + surat.getId());
                surat.setFilePath(storagePath);
                surat.setNamaFile(file.getOriginalFilename());
                surat = repository.save(surat);
            } catch (Exception e) {
                throw new RuntimeException("Gagal menyimpan berkas lampiran: " + e.getMessage());
            }
        }

        SuratMasukResponse saved = toResponse(surat);

        String detail = "Menambah surat masuk baru (" + saved.getPerihal() + ").";

        auditLogService.createLog("CREATE", "Surat Masuk", saved.getId(),
                saved.getNomorSurat(), detail, getCurrentUser());

        return saved;
    }

    @Transactional
    public SuratMasukResponse update(Long id, SuratMasukRequest request, org.springframework.web.multipart.MultipartFile file) {
        SuratMasuk surat = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Surat not found"));

        String oldStatus = surat.getStatus();

        surat.setNomorSurat(request.getNomorSurat());
        surat.setTanggal(request.getTanggal());
        surat.setPengirim(request.getPengirim());
        surat.setPerihal(request.getPerihal());
        surat.setIsiSingkat(request.getIsiSingkat());
        surat.setStatus(request.getStatus());

        if (file != null && !file.isEmpty()) {
            try {
                String storagePath = fileStorageService.storeFile(file, "surat-masuk/" + id);
                surat.setFilePath(storagePath);
                surat.setNamaFile(file.getOriginalFilename());
            } catch (Exception e) {
                throw new RuntimeException("Gagal menyimpan berkas lampiran: " + e.getMessage());
            }
        }

        SuratMasukResponse updated = toResponse(repository.save(surat));

        String detail;
        if (!oldStatus.equals(updated.getStatus())) {
            detail = "Mengubah status dari " + oldStatus + " ke " + updated.getStatus() + ".";
        } else {
            detail = "Mengubah data surat masuk (" + updated.getPerihal() + ").";
        }
        auditLogService.createLog("UPDATE", "Surat Masuk", updated.getId(),
                updated.getNomorSurat(), detail, getCurrentUser());

        return updated;
    }

    @Transactional
    public void delete(Long id) {
        SuratMasuk surat = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Surat not found"));
        String nomor = surat.getNomorSurat();
        repository.deleteById(id);
        auditLogService.createLog("DELETE", "Surat Masuk", id,
                nomor, "Menghapus surat masuk " + nomor + ".", getCurrentUser());
    }

    @Transactional
    public void batchDelete(List<Long> ids) {
        repository.deleteAllById(ids);
    }

    private SuratMasukResponse toResponse(SuratMasuk surat) {
        return new SuratMasukResponse(
                surat.getId(),
                surat.getNomorSurat(),
                surat.getTanggal(),
                surat.getPengirim(),
                surat.getPerihal(),
                surat.getIsiSingkat(),
                surat.getStatus(),
                surat.getFilePath(),
                surat.getNamaFile(),
                surat.getCreatedBy() != null ? surat.getCreatedBy().getUsername() : null,
                surat.getCreatedAt(),
                surat.getUpdatedAt()
        );
    }
}
