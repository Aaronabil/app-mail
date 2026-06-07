package com.aplikasiberkas.repository;

import com.aplikasiberkas.entity.SuratKeluar;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SuratKeluarRepository extends JpaRepository<SuratKeluar, Long>, 
        JpaSpecificationExecutor<SuratKeluar> {
    
    List<SuratKeluar> findByTanggalBetween(LocalDate startDate, LocalDate endDate);
    
    List<SuratKeluar> findByStatus(String status);
    
    boolean existsByNomorSurat(String nomorSurat);
    
    long countByStatus(String status);
}
