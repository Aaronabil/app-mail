package com.aplikasiberkas.dto;

import lombok.Data;

import java.util.List;

@Data
public class AuditLogPageResponse {

    private List<AuditLogResponse> content;
    private long totalElements;
    private int totalPages;
    private int currentPage;
    private int size;
}
