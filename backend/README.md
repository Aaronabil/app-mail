# Aplikasi Berkas - Backend

Backend Spring Boot untuk sistem manajemen berkas/surat masuk dan keluar.

## Tech Stack

- Spring Boot 3.3.0
- Spring Security
- Spring Data JPA
- PostgreSQL / H2 (dev)
- Lombok
- OpenPDF

## Setup

### Prerequisites

- Java 17+
- Maven 3.6+
- PostgreSQL (opsional, bisa pakai H2 untuk dev)

### Run Application

```bash
# Development (H2 in-memory database)
mvn spring-boot:run

# Production (PostgreSQL)
# 1. Ubah application.properties, uncomment PostgreSQL config
# 2. Buat database: createdb berkasdb
# 3. Run
mvn spring-boot:run
```

Backend akan berjalan di `http://localhost:8080`

### Default User

- Username: `admin`
- Password: `admin123`

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics

### Surat Masuk
- `GET /api/surat-masuk` - List (dengan filter, search, sort)
- `GET /api/surat-masuk/{id}` - Detail
- `POST /api/surat-masuk` - Create
- `PUT /api/surat-masuk/{id}` - Update
- `DELETE /api/surat-masuk/{id}` - Delete
- `POST /api/surat-masuk/batch-delete` - Batch delete

### Surat Keluar
- `GET /api/surat-keluar` - List (dengan filter, search, sort)
- `GET /api/surat-keluar/{id}` - Detail
- `POST /api/surat-keluar` - Create
- `PUT /api/surat-keluar/{id}` - Update
- `DELETE /api/surat-keluar/{id}` - Delete
- `POST /api/surat-keluar/batch-delete` - Batch delete

### PDF Export
- `GET /api/pdf/surat-masuk/{id}` - Export single surat masuk
- `GET /api/pdf/surat-keluar/{id}` - Export single surat keluar
- `POST /api/pdf/surat-masuk/batch` - Export batch surat masuk
- `POST /api/pdf/surat-keluar/batch` - Export batch surat keluar

## Features

- CRUD surat masuk & keluar
- Auto-generate nomor surat (format: 001/SM/2026 atau 001/SK/2026)
- Sorting & filtering
- Search
- Batch delete
- PDF export (single & batch)
- Audit log (created_by, created_at, updated_at)
- Status workflow
- HTTP Basic Authentication
- CORS enabled untuk frontend

## Database Schema

### users
- id, username, password, full_name, role, created_at

### surat_masuk
- id, nomor_surat, tanggal, pengirim, perihal, isi_singkat, status, file_path, created_by, created_at, updated_at

### surat_keluar
- id, nomor_surat, tanggal, penerima, perihal, isi_singkat, status, file_path, created_by, created_at, updated_at

## Development

### H2 Console (Development Mode)

Akses: `http://localhost:8080/api/h2-console`

- JDBC URL: `jdbc:h2:mem:berkasdb`
- Username: `sa`
- Password: (kosong)

### Build

```bash
mvn clean package
```

JAR akan di-generate di `target/aplikasi-berkas-backend-1.0.0.jar`

### Run JAR

```bash
java -jar target/aplikasi-berkas-backend-1.0.0.jar
```
