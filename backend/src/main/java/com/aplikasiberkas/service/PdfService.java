package com.aplikasiberkas.service;

import com.aplikasiberkas.entity.SuratKeluar;
import com.aplikasiberkas.entity.SuratMasuk;
import com.aplikasiberkas.repository.SuratKeluarRepository;
import com.aplikasiberkas.repository.SuratMasukRepository;
import com.lowagie.text.*;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.awt.Color;

@Service
@RequiredArgsConstructor
public class PdfService {

    private final SuratMasukRepository suratMasukRepository;
    private final SuratKeluarRepository suratKeluarRepository;

    public byte[] generateSuratMasukPdf(Long id) throws DocumentException {
        SuratMasuk surat = suratMasukRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Surat not found"));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);
        
        document.open();
        
        Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
        Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD);
        Font normalFont = new Font(Font.HELVETICA, 11);

        Paragraph title = new Paragraph("SURAT MASUK", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        addDetailRow(document, "Nomor Surat:", surat.getNomorSurat(), headerFont, normalFont);
        addDetailRow(document, "Tanggal:", 
                surat.getTanggal().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")), 
                headerFont, normalFont);
        addDetailRow(document, "Pengirim:", surat.getPengirim(), headerFont, normalFont);
        addDetailRow(document, "Perihal:", surat.getPerihal(), headerFont, normalFont);
        addDetailRow(document, "Status:", surat.getStatus(), headerFont, normalFont);
        
        if (surat.getIsiSingkat() != null && !surat.getIsiSingkat().isEmpty()) {
            document.add(new Paragraph("\n"));
            document.add(new Paragraph("Isi Singkat:", headerFont));
            document.add(new Paragraph(surat.getIsiSingkat(), normalFont));
        }

        document.close();
        return baos.toByteArray();
    }

    public byte[] generateSuratKeluarPdf(Long id) throws DocumentException {
        SuratKeluar surat = suratKeluarRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Surat not found"));

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, baos);
        
        document.open();
        
        Font titleFont = new Font(Font.HELVETICA, 18, Font.BOLD);
        Font headerFont = new Font(Font.HELVETICA, 12, Font.BOLD);
        Font normalFont = new Font(Font.HELVETICA, 11);

        Paragraph title = new Paragraph("SURAT KELUAR", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        addDetailRow(document, "Nomor Surat:", surat.getNomorSurat(), headerFont, normalFont);
        addDetailRow(document, "Tanggal:", 
                surat.getTanggal().format(DateTimeFormatter.ofPattern("dd MMMM yyyy")), 
                headerFont, normalFont);
        addDetailRow(document, "Penerima:", surat.getPenerima(), headerFont, normalFont);
        addDetailRow(document, "Perihal:", surat.getPerihal(), headerFont, normalFont);
        addDetailRow(document, "Status:", surat.getStatus(), headerFont, normalFont);
        
        if (surat.getIsiSingkat() != null && !surat.getIsiSingkat().isEmpty()) {
            document.add(new Paragraph("\n"));
            document.add(new Paragraph("Isi Singkat:", headerFont));
            document.add(new Paragraph(surat.getIsiSingkat(), normalFont));
        }

        document.close();
        return baos.toByteArray();
    }

    public byte[] generateSuratMasukListPdf(List<Long> ids) throws DocumentException {
        List<SuratMasuk> suratList;
        
        if (ids == null || ids.isEmpty()) {
            suratList = suratMasukRepository.findAll();
        } else {
            suratList = suratMasukRepository.findAllById(ids);
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, baos);
        
        document.open();
        
        Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD);
        Paragraph title = new Paragraph("DAFTAR SURAT MASUK", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(15);
        document.add(title);

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);

        addTableHeader(table, "No");
        addTableHeader(table, "Nomor Surat");
        addTableHeader(table, "Tanggal");
        addTableHeader(table, "Pengirim");
        addTableHeader(table, "Perihal");
        addTableHeader(table, "Status");

        int no = 1;
        for (SuratMasuk surat : suratList) {
            table.addCell(String.valueOf(no++));
            table.addCell(surat.getNomorSurat());
            table.addCell(surat.getTanggal().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            table.addCell(surat.getPengirim());
            table.addCell(surat.getPerihal());
            table.addCell(surat.getStatus());
        }

        document.add(table);
        document.close();
        return baos.toByteArray();
    }

    public byte[] generateSuratKeluarListPdf(List<Long> ids) throws DocumentException {
        List<SuratKeluar> suratList;
        
        if (ids == null || ids.isEmpty()) {
            suratList = suratKeluarRepository.findAll();
        } else {
            suratList = suratKeluarRepository.findAllById(ids);
        }

        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4.rotate());
        PdfWriter.getInstance(document, baos);
        
        document.open();
        
        Font titleFont = new Font(Font.HELVETICA, 16, Font.BOLD);
        Paragraph title = new Paragraph("DAFTAR SURAT KELUAR", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(15);
        document.add(title);

        PdfPTable table = new PdfPTable(6);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10);

        addTableHeader(table, "No");
        addTableHeader(table, "Nomor Surat");
        addTableHeader(table, "Tanggal");
        addTableHeader(table, "Penerima");
        addTableHeader(table, "Perihal");
        addTableHeader(table, "Status");

        int no = 1;
        for (SuratKeluar surat : suratList) {
            table.addCell(String.valueOf(no++));
            table.addCell(surat.getNomorSurat());
            table.addCell(surat.getTanggal().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")));
            table.addCell(surat.getPenerima());
            table.addCell(surat.getPerihal());
            table.addCell(surat.getStatus());
        }

        document.add(table);
        document.close();
        return baos.toByteArray();
    }

    private void addDetailRow(Document document, String label, String value, 
            Font labelFont, Font valueFont) throws DocumentException {
        Paragraph p = new Paragraph();
        p.add(new Chunk(label + " ", labelFont));
        p.add(new Chunk(value, valueFont));
        p.setSpacingAfter(8);
        document.add(p);
    }

    private void addTableHeader(PdfPTable table, String header) {
        PdfPCell cell = new PdfPCell();
        cell.setBackgroundColor(new Color(200, 200, 200));
        cell.setPadding(5);
        cell.setPhrase(new Phrase(header, new Font(Font.HELVETICA, 10, Font.BOLD)));
        table.addCell(cell);
    }
}
