# Aplikasi Berkas

Aplikasi manajemen surat masuk dan keluar berbasis web dengan Java Spring Boot (backend) dan React (frontend).

## Struktur Project

```
.
├── app-mail/   # Spring Boot backend
└── app-mail/  # React frontend
```

## Tech Stack

### Backend
- Spring Boot 3.3.0
- Spring Security + JPA
- PostgreSQL / H2
- OpenPDF
- Maven

### Frontend
- React 18.3
- TypeScript
- Vite
- shadcn/ui + Tailwind
- TanStack Query
- React Hook Form + Zod

## Features

✅ Dashboard dengan statistik
✅ CRUD surat masuk & keluar
✅ Sorting by date (ASC/DESC)
✅ Filter by date range, status
✅ Search (nomor surat, pengirim/penerima, perihal)
✅ Export PDF (single & batch)
✅ Auto-generate nomor surat (001/SM/2026, 001/SK/2026)
✅ Status workflow (DRAFT → SENT → ARCHIVED)
✅ Audit log (created_by, created_at, updated_at)
✅ Batch delete (multi-select)
✅ Form validation
✅ Responsive design

## Quick Start

### Prerequisites
- Java 17+
- Maven 3.6+
- Node.js 18+
- npm/yarn

### 1. Backend Setup

```bash
cd app-mail/backend

# Run dengan H2 in-memory database
mvn spring-boot:run
```

Backend akan running di `http://localhost:8080`

Default credentials:
- Username: `admin`
- Password: `admin123`

### 2. Frontend Setup

```bash
cd app-mail/frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend akan running di `http://localhost:5173`

### 3. Access Application

Buka browser: `http://localhost:5173`

Login dengan:
- Username: `admin`
- Password: `admin123`

## Development

### Backend (Port 8080)

```bash
cd app-mail/backend

# Run
mvn spring-boot:run

### Frontend (Port 5173)

```bash
cd app-mail/frontend

# Install dependencies
npm install

# Development
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Production Setup

### Backend dengan PostgreSQL

1. Install PostgreSQL dan buat database:
```bash
createdb berkasdb
```

2. Edit `aplikasi-berkas-backend/src/main/resources/application.properties`:
```properties
# Comment H2 config, uncomment PostgreSQL config
spring.datasource.url=jdbc:postgresql://localhost:5432/berkasdb
spring.datasource.username=postgres
spring.datasource.password=yourpassword
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect
```

3. Run backend:
```bash
mvn spring-boot:run
```

### Frontend Production Build

```bash
cd app-mail/frontend
npm run build
```

Serve folder `dist/` dengan web server (nginx, Apache, dll).

## API Documentation

### Endpoints

**Authentication:**
- `POST /api/auth/login`
- `POST /api/auth/logout`

**Dashboard:**
- `GET /api/dashboard/stats`

**Surat Masuk:**
- `GET /api/surat-masuk` (list with filter/search/sort)
- `GET /api/surat-masuk/{id}` (detail)
- `POST /api/surat-masuk` (create)
- `PUT /api/surat-masuk/{id}` (update)
- `DELETE /api/surat-masuk/{id}` (delete)
- `POST /api/surat-masuk/batch-delete` (batch delete)

**Surat Keluar:**
- `GET /api/surat-keluar` (list with filter/search/sort)
- `GET /api/surat-keluar/{id}` (detail)
- `POST /api/surat-keluar` (create)
- `PUT /api/surat-keluar/{id}` (update)
- `DELETE /api/surat-keluar/{id}` (delete)
- `POST /api/surat-keluar/batch-delete` (batch delete)

**PDF Export:**
- `GET /api/pdf/surat-masuk/{id}` (single)
- `GET /api/pdf/surat-keluar/{id}` (single)
- `POST /api/pdf/surat-masuk/batch` (batch)
- `POST /api/pdf/surat-keluar/batch` (batch)

## Database Schema

### users
- id, username, password, full_name, role, created_at

### surat_masuk
- id, nomor_surat, tanggal, pengirim, perihal, isi_singkat, status, file_path, created_by, created_at, updated_at

### surat_keluar
- id, nomor_surat, tanggal, penerima, perihal, isi_singkat, status, file_path, created_by, created_at, updated_at

## Dummy Data

Backend otomatis seed dummy data saat pertama kali running:
- 1 admin user
- 5 surat masuk (dummy)
- 5 surat keluar (dummy)

## Troubleshooting

**Backend tidak bisa start:**
- Pastikan port 8080 tidak dipakai aplikasi lain
- Check Java version: `java -version` (harus 17+)

**Frontend tidak bisa connect ke backend:**
- Pastikan backend running di port 8080
- Check console browser untuk error CORS

**PDF tidak bisa di-download:**
- Check browser console untuk error
- Pastikan backend bisa akses OpenPDF library

## License

MIT
