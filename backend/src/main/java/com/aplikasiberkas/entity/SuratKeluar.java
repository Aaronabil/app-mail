package com.aplikasiberkas.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "surat_keluar")
@EntityListeners(AuditingEntityListener.class)
public class SuratKeluar {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false, length = 50)
    private String nomorSurat;

    @Column(nullable = false)
    private LocalDate tanggal;

    @Column(nullable = false, length = 100)
    private String penerima;

    @Column(nullable = false)
    private String perihal;

    @Column(columnDefinition = "TEXT")
    private String isiSingkat;

    @Column(length = 20)
    private String status = "DRAFT";

    private String filePath;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;
}
