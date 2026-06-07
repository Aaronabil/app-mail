package com.aplikasiberkas.service;

import com.aplikasiberkas.dto.SuratMasukRequest;
import com.aplikasiberkas.dto.SuratMasukResponse;
import com.aplikasiberkas.entity.SuratMasuk;
import com.aplikasiberkas.entity.User;
import com.aplikasiberkas.repository.SuratMasukRepository;
import com.aplikasiberkas.util.NomorSuratGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuratMasukService {

    private final SuratMasukRepository repository;
    private final NomorSuratGenerator nomorSuratGenerator;

    @Transactional(readOnly = true)
    public List<SuratMasukResponse> getAll(String status, LocalDate startDate, 
            LocalDate endDate, String search, String sortBy, String sortDir) {
        
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

        Sort sort = Sort.by(Sort.Direction.fromString(sortDir != null ? sortDir : "DESC"), 
                sortBy != null ? sortBy : "tanggal");

        return repository.findAll(spec, sort).stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public SuratMasukResponse getById(Long id) {
        SuratMasuk surat = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Surat not found"));
        return toResponse(surat);
    }

    @Transactional
    public SuratMasukResponse create(SuratMasukRequest request, User user) {
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

        return toResponse(repository.save(surat));
    }

    @Transactional
    public SuratMasukResponse update(Long id, SuratMasukRequest request) {
        SuratMasuk surat = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Surat not found"));

        surat.setNomorSurat(request.getNomorSurat());
        surat.setTanggal(request.getTanggal());
        surat.setPengirim(request.getPengirim());
        surat.setPerihal(request.getPerihal());
        surat.setIsiSingkat(request.getIsiSingkat());
        surat.setStatus(request.getStatus());

        return toResponse(repository.save(surat));
    }

    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
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
                surat.getCreatedBy() != null ? surat.getCreatedBy().getUsername() : null,
                surat.getCreatedAt(),
                surat.getUpdatedAt()
        );
    }
}
