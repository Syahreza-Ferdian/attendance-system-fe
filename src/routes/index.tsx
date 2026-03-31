import { createBrowserRouter, Navigate } from "react-router-dom";
import authRoutes from "./auth.routes";
import adminRoutes from "./admin.routes";
import employeeRoutes from "./employee.routes";

const router = createBrowserRouter([
  // Redirect root ke login
  { index: true, element: <Navigate to="/login" replace /> },

  // Auth routes
  ...authRoutes,

  // Admin routes
  ...adminRoutes,

  ...employeeRoutes,

  // 404 fallback
  {
    path: "*",
    element: (
      <div className="min-h-screen flex items-center justify-center bg-surface-secondary">
        <div className="text-center">
          <p className="text-6xl font-bold text-slate-200 mb-4">404</p>
          <p className="text-lg font-semibold text-ink mb-1">
            Halaman tidak ditemukan
          </p>
          <p className="text-sm text-ink-tertiary mb-6">
            URL yang Anda akses tidak tersedia.
          </p>
          <a href="/" className="text-sm text-primary-600 hover:underline">
            Kembali ke beranda
          </a>
        </div>
      </div>
    ),
  },
]);

export default router;
