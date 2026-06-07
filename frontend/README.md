# Aplikasi Berkas - Frontend

Frontend React dengan shadcn/ui untuk sistem manajemen berkas/surat masuk dan keluar.

## Tech Stack

- React 18.3
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Query (React Query)
- React Router
- React Hook Form + Zod
- Axios

## Setup

### Prerequisites

- Node.js 18+
- npm atau yarn

### Install Dependencies

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

**IMPORTANT:** Backend harus running di `http://localhost:8080`

## Build

```bash
npm run build
```

Output akan di-generate di folder `dist/`

## Features

- Dashboard dengan statistik
- CRUD surat masuk & keluar
- Sorting & filtering (by date, status)
- Search (nomor surat, pengirim/penerima, perihal)
- Batch operations (multi-select, batch delete)
- Export PDF (single & batch)
- Auto-generate nomor surat
- Form validation dengan Zod
- Responsive design

## Project Structure

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── Layout.tsx       # Main layout wrapper
│   └── Sidebar.tsx      # Navigation sidebar
├── pages/
│   ├── Dashboard.tsx
│   ├── SuratMasukList.tsx
│   ├── SuratMasukForm.tsx
│   ├── SuratKeluarList.tsx
│   └── SuratKeluarForm.tsx
├── services/
│   ├── api.ts           # Axios instance
│   ├── auth.ts          # Auth service
│   └── surat.ts         # Surat service
├── types/
│   └── index.ts         # TypeScript types
├── lib/
│   └── utils.ts         # Utility functions
├── App.tsx              # Router setup
└── main.tsx             # Entry point
```

## Authentication

Default login credentials:
- Username: `admin`
- Password: `admin123`

Backend menggunakan HTTP Basic Auth, credentials sudah di-configure di `src/services/api.ts`

## API Integration

Frontend berkomunikasi dengan backend melalui proxy Vite (configured di `vite.config.ts`):
- `/api/*` → `http://localhost:8080/api/*`

## Styling

Menggunakan shadcn/ui dengan Tailwind CSS. Theme variables ada di `src/index.css`

Custom colors dan design tokens bisa dimodifikasi di:
- `tailwind.config.js`
- `src/index.css` (CSS variables)

## Development Notes

- Form validation menggunakan Zod schema
- Data fetching menggunakan TanStack Query (auto caching, refetch, mutations)
- HTTP Basic Auth credentials di-inject di setiap request
- PDF export langsung download via blob URL
