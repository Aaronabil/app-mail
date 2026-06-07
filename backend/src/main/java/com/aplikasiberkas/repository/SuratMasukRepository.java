package com.aplikasiberkas.repository;

import com.aplikasiberkas.entity.SuratMasuk;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface SuratMasukRepository extends JpaRepository<SuratMasuk, Long>, 
        JpaSpecificationExecutor<SuratMasuk> {
    
    List<SuratMasuk> findByTanggalBetween(LocalDate startDate, LocalDate endDate);
    
    List<SuratMasuk> findByStatus(String status);
    
    boolean existsByNomorSurat(String nomorSurat);
    
    long countByStatus(String status);
}
