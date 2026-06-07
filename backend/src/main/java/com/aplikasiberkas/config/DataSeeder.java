package com.aplikasiberkas.config;

import com.aplikasiberkas.entity.SuratKeluar;
import com.aplikasiberkas.entity.SuratMasuk;
import com.aplikasiberkas.entity.User;
import com.aplikasiberkas.repository.SuratKeluarRepository;
import com.aplikasiberkas.repository.SuratMasukRepository;
import com.aplikasiberkas.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final SuratMasukRepository suratMasukRepository;
    private final SuratKeluarRepository suratKeluarRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedUsers();
            seedSuratMasuk();
            seedSuratKeluar();
        }
    }

    private void seedUsers() {
        User admin = new User();
        admin.setUsername("admin");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setFullName("Administrator");
        admin.setRole("ADMIN");
        userRepository.save(admin);
        
        System.out.println("✓ Admin user created (username: admin, password: admin123)");
    }

    private void seedSuratMasuk() {
        User admin = userRepository.findByUsername("admin").orElseThrow();

        SuratMasuk sm1 = new SuratMasuk();
        sm1.setNomorSurat("001/SM/2026");
        sm1.setTanggal(LocalDate.of(2026, 1, 15));
        sm1.setPengirim("Dinas Pendidikan");
        sm1.setPerihal("Undangan Rapat Koordinasi");
        sm1.setIsiSingkat("Mengundang untuk hadir dalam rapat koordinasi program pendidikan tahun 2026");
        sm1.setStatus("RECEIVED");
        sm1.setCreatedBy(admin);
        suratMasukRepository.save(sm1);

        SuratMasuk sm2 = new SuratMasuk();
        sm2.setNomorSurat("002/SM/2026");
        sm2.setTanggal(LocalDate.of(2026, 2, 20));
        sm2.setPengirim("Kementerian Keuangan");
        sm2.setPerihal("Laporan Keuangan Triwulan I");
        sm2.setIsiSingkat("Permintaan laporan keuangan triwulan pertama tahun anggaran 2026");
        sm2.setStatus("ARCHIVED");
        sm2.setCreatedBy(admin);
        suratMasukRepository.save(sm2);

        SuratMasuk sm3 = new SuratMasuk();
        sm3.setNomorSurat("003/SM/2026");
        sm3.setTanggal(LocalDate.of(2026, 3, 10));
        sm3.setPengirim("BKN Regional");
        sm3.setPerihal("Pengajuan Kenaikan Pangkat");
        sm3.setIsiSingkat("Pemberitahuan hasil verifikasi pengajuan kenaikan pangkat periode April 2026");
        sm3.setStatus("RECEIVED");
        sm3.setCreatedBy(admin);
        suratMasukRepository.save(sm3);

        SuratMasuk sm4 = new SuratMasuk();
        sm4.setNomorSurat("004/SM/2026");
        sm4.setTanggal(LocalDate.of(2026, 4, 5));
        sm4.setPengirim("Inspektorat Daerah");
        sm4.setPerihal("Audit Internal Tahun 2026");
        sm4.setIsiSingkat("Pemberitahuan jadwal pelaksanaan audit internal");
        sm4.setStatus("RECEIVED");
        sm4.setCreatedBy(admin);
        suratMasukRepository.save(sm4);

        SuratMasuk sm5 = new SuratMasuk();
        sm5.setNomorSurat("005/SM/2026");
        sm5.setTanggal(LocalDate.of(2026, 5, 12));
        sm5.setPengirim("Badan Kepegawaian");
        sm5.setPerihal("Usulan Formasi CPNS 2026");
        sm5.setIsiSingkat("Pengajuan formasi CPNS untuk tahun anggaran 2027");
        sm5.setStatus("ARCHIVED");
        sm5.setCreatedBy(admin);
        suratMasukRepository.save(sm5);

        System.out.println("✓ 5 Surat Masuk created");
    }

    private void seedSuratKeluar() {
        User admin = userRepository.findByUsername("admin").orElseThrow();

        SuratKeluar sk1 = new SuratKeluar();
        sk1.setNomorSurat("001/SK/2026");
        sk1.setTanggal(LocalDate.of(2026, 1, 20));
        sk1.setPenerima("Gubernur Provinsi");
        sk1.setPerihal("Laporan Kegiatan Bulan Januari");
        sk1.setIsiSingkat("Laporan pelaksanaan kegiatan dan realisasi anggaran bulan Januari 2026");
        sk1.setStatus("SENT");
        sk1.setCreatedBy(admin);
        suratKeluarRepository.save(sk1);

        SuratKeluar sk2 = new SuratKeluar();
        sk2.setNomorSurat("002/SK/2026");
        sk2.setTanggal(LocalDate.of(2026, 2, 25));
        sk2.setPenerima("Walikota");
        sk2.setPerihal("Permohonan Bantuan Dana");
        sk2.setIsiSingkat("Permohonan bantuan dana untuk program pembangunan infrastruktur");
        sk2.setStatus("DRAFT");
        sk2.setCreatedBy(admin);
        suratKeluarRepository.save(sk2);

        SuratKeluar sk3 = new SuratKeluar();
        sk3.setNomorSurat("003/SK/2026");
        sk3.setTanggal(LocalDate.of(2026, 3, 15));
        sk3.setPenerima("Direktur RSUD");
        sk3.setPerihal("Kerjasama Pelayanan Kesehatan");
        sk3.setIsiSingkat("Usulan kerjasama pelayanan kesehatan untuk pegawai");
        sk3.setStatus("SENT");
        sk3.setCreatedBy(admin);
        suratKeluarRepository.save(sk3);

        SuratKeluar sk4 = new SuratKeluar();
        sk4.setNomorSurat("004/SK/2026");
        sk4.setTanggal(LocalDate.of(2026, 4, 10));
        sk4.setPenerima("Kepala Dinas Perhubungan");
        sk4.setPerihal("Permohonan Izin Kegiatan");
        sk4.setIsiSingkat("Permohonan izin penggunaan jalan untuk kegiatan hari jadi instansi");
        sk4.setStatus("ARCHIVED");
        sk4.setCreatedBy(admin);
        suratKeluarRepository.save(sk4);

        SuratKeluar sk5 = new SuratKeluar();
        sk5.setNomorSurat("005/SK/2026");
        sk5.setTanggal(LocalDate.of(2026, 5, 18));
        sk5.setPenerima("Rektor Universitas");
        sk5.setPerihal("Undangan Narasumber Seminar");
        sk5.setIsiSingkat("Undangan sebagai narasumber seminar nasional tentang good governance");
        sk5.setStatus("DRAFT");
        sk5.setCreatedBy(admin);
        suratKeluarRepository.save(sk5);

        System.out.println("✓ 5 Surat Keluar created");
    }
}
