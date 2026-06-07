package com.aplikasiberkas.repository;

import com.aplikasiberkas.entity.AuditLog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    Page<AuditLog> findAll(Pageable pageable);

    @Query("SELECT a FROM AuditLog a WHERE " +
           "(:search IS NULL OR LOWER(a.entityLabel) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(a.actor) LIKE LOWER(CONCAT('%', :search, '%')) OR " +
           " LOWER(a.details) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:action IS NULL OR a.action = :action) AND " +
           "(:entityType IS NULL OR a.entityType = :entityType) AND " +
           "(:startDate IS NULL OR a.timestamp >= :startDate) AND " +
           "(:endDate IS NULL OR a.timestamp <= :endDate)")
    Page<AuditLog> search(@Param("search") String search,
                          @Param("action") String action,
                          @Param("entityType") String entityType,
                          @Param("startDate") java.time.LocalDateTime startDate,
                          @Param("endDate") java.time.LocalDateTime endDate,
                          Pageable pageable);
}
