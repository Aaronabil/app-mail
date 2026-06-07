package com.aplikasiberkas.service;

import com.aplikasiberkas.dto.SuratKeluarRequest;
import com.aplikasiberkas.dto.SuratKeluarResponse;
import com.aplikasiberkas.entity.SuratKeluar;
import com.aplikasiberkas.entity.User;
import com.aplikasiberkas.repository.SuratKeluarRepository;
import com.aplikasiberkas.util.NomorSuratGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuratKeluarService {

    private final SuratKeluarRepository repository;
    private final NomorSuratGenerator nomorSuratGenerator;
    private final AuditLogService auditLogService;

    private String getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
            return auth.getName();
        }
        return "System";
    }

    @Transactional(readOnly = true)
    public List<SuratKeluarResponse> getAll(String status, LocalDate startDate,
            LocalDate endDate, String search, String sortBy, String sortDir) {

        Specification<SuratKeluar> spec = Specification.where(null);

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
                    cb.like(cb.lower(root.get("penerima")), "%" + search.toLowerCase() + "%"),
                    cb.like(cb.lower(root.get("perihal")), "%" + search.toLowerCase() + "%")
                ));
        }

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir != null ? sortDir : "DESC"),
                sortBy != null ? sortBy : "tanggal");

        return repository.findAll(spec, sort).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SuratKeluarResponse getById(Long id) {
        SuratKeluar surat = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Surat not found"));
        return toResponse(surat);
    }

    @Transactional
    public SuratKeluarResponse create(SuratKeluarRequest request, User user) {
        SuratKeluar surat = new SuratKeluar();

        if (request.getNomorSurat() == null || request.getNomorSurat().isEmpty()) {
            surat.setNomorSurat(nomorSuratGenerator.generateNomorSuratKeluar());
        } else {
            surat.setNomorSurat(request.getNomorSurat());
        }

        surat.setTanggal(request.getTanggal());
        surat.setPenerima(request.getPenerima());
        surat.setPerihal(request.getPerihal());
        surat.setIsiSingkat(request.getIsiSingkat());
        surat.setStatus(request.getStatus() != null ? request.getStatus() : "DRAFT");
        surat.setCreatedBy(user);

        SuratKeluarResponse saved = toResponse(repository.save(surat));

        String detail = "Menambah surat keluar baru (" + saved.getPerihal() + ").";
        auditLogService.createLog("CREATE", "Surat Keluar", saved.getId(),
                saved.getNomorSurat(), detail, getCurrentUser());

        return saved;
    }

    @Transactional
    public SuratKeluarResponse update(Long id, SuratKeluarRequest request) {
        SuratKeluar surat = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Surat not found"));

        String oldStatus = surat.getStatus();

        surat.setNomorSurat(request.getNomorSurat());
        surat.setTanggal(request.getTanggal());
        surat.setPenerima(request.getPenerima());
        surat.setPerihal(request.getPerihal());
        surat.setIsiSingkat(request.getIsiSingkat());
        surat.setStatus(request.getStatus());

        SuratKeluarResponse updated = toResponse(repository.save(surat));

        String detail;
        if (!oldStatus.equals(updated.getStatus())) {
            detail = "Mengubah status dari " + oldStatus + " ke " + updated.getStatus() + ".";
        } else {
            detail = "Mengubah data surat keluar (" + updated.getPerihal() + ").";
        }
        auditLogService.createLog("UPDATE", "Surat Keluar", updated.getId(),
                updated.getNomorSurat(), detail, getCurrentUser());

        return updated;
    }

    @Transactional
    public void delete(Long id) {
        SuratKeluar surat = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Surat not found"));
        String nomor = surat.getNomorSurat();
        repository.deleteById(id);
        auditLogService.createLog("DELETE", "Surat Keluar", id,
                nomor, "Menghapus surat keluar " + nomor + ".", getCurrentUser());
    }

    @Transactional
    public void batchDelete(List<Long> ids) {
        repository.deleteAllById(ids);
    }

    private SuratKeluarResponse toResponse(SuratKeluar surat) {
        return new SuratKeluarResponse(
                surat.getId(),
                surat.getNomorSurat(),
                surat.getTanggal(),
                surat.getPenerima(),
                surat.getPerihal(),
                surat.getIsiSingkat(),
                surat.getStatus(),
                surat.getFilePath(),
                surat.getCreatedBy() != null ? surat.getCreatedBy().getUsername() : null,
                surat.getCreatedAt(),
                surat.getUpdatedAt()
        );
    }
}
