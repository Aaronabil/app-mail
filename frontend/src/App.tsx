import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { SuratMasukList } from './pages/SuratMasukList';
import { SuratKeluarList } from './pages/SuratKeluarList';
import { LoginPage } from './pages/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout><Dashboard /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/surat-masuk"
            element={
              <ProtectedRoute>
                <Layout><SuratMasukList /></Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/surat-keluar"
            element={
              <ProtectedRoute>
                <Layout><SuratKeluarList /></Layout>
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
