package com.aplikasiberkas.service;

import com.aplikasiberkas.dto.AuditLogPageResponse;
import com.aplikasiberkas.dto.AuditLogResponse;
import com.aplikasiberkas.entity.AuditLog;
import com.aplikasiberkas.repository.AuditLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuditLogService {

    private final AuditLogRepository repository;

    public AuditLogPageResponse getAuditLogs(
            String search,
            String action,
            String entityType,
            String startDate,
            String endDate,
            int page,
            int size) {

        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "timestamp"));

        LocalDateTime startDt = startDate != null ? LocalDateTime.of(LocalDate.parse(startDate), LocalTime.MIN) : null;
        LocalDateTime endDt = endDate != null ? LocalDateTime.of(LocalDate.parse(endDate), LocalTime.MAX) : null;

        Page<AuditLog> auditPage = repository.search(search, action, entityType, startDt, endDt, pageRequest);

        List<AuditLogResponse> responses = auditPage.getContent().stream()
                .map(this::toResponse)
                .toList();

        AuditLogPageResponse response = new AuditLogPageResponse();
        response.setContent(responses);
        response.setTotalElements(auditPage.getTotalElements());
        response.setTotalPages(auditPage.getTotalPages());
        response.setCurrentPage(auditPage.getNumber());
        response.setSize(auditPage.getSize());
        return response;
    }

    @org.springframework.transaction.annotation.Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    public AuditLog createLog(String action, String entityType, Long entityId,
                              String entityLabel, String details, String actor) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setEntityType(entityType);
        log.setEntityId(entityId);
        log.setEntityLabel(entityLabel);
        log.setDetails(details);
        log.setActor(actor);
        log.setTimestamp(LocalDateTime.now());
        return repository.save(log);
    }

    private AuditLogResponse toResponse(AuditLog log) {
        return new AuditLogResponse(
                log.getId(),
                log.getAction(),
                log.getEntityType(),
                log.getEntityId(),
                log.getEntityLabel(),
                log.getDetails(),
                log.getActor(),
                log.getTimestamp()
        );
    }
}
