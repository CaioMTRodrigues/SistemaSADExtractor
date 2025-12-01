import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import EditPage from "./pages/EditPage";
import ExportarPage from "./pages/ExportarPage";
import HistoricoPage from "./pages/HistoricoPage";
import HistoricoUsuariosPage from "./pages/HistoricoUsuariosPage";
import IndicadoresPage from "./pages/IndicadoresPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";
import ProtectedRoute from "./components/ProtectedRoute";
import CreatePasswordPage from "./pages/CriarSenhaPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/create-password" element={<CreatePasswordPage />} />

        {/* Cadastro rotas */}
        <Route path="/cadastro/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/cadastro/edit" element={<ProtectedRoute><EditPage /></ProtectedRoute>} />
        <Route path="/cadastro/exportar" element={<ProtectedRoute><ExportarPage /></ProtectedRoute>} />
        <Route path="/cadastro/historico" element={<ProtectedRoute><HistoricoPage /></ProtectedRoute>} />

        {/* Gestor rotas */}
        <Route path="/gestor/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/gestor/edit" element={<ProtectedRoute><EditPage /></ProtectedRoute>} />
        <Route path="/gestor/exportar" element={<ProtectedRoute><ExportarPage /></ProtectedRoute>} />
        <Route path="/gestor/historico" element={<ProtectedRoute><HistoricoPage /></ProtectedRoute>} />
        <Route path="/gestor/historico-usuarios" element={<ProtectedRoute><HistoricoUsuariosPage /></ProtectedRoute>} />
        <Route path="/gestor/indicadores" element={<ProtectedRoute><IndicadoresPage /></ProtectedRoute>} />

        {/* Admin rotas */}
        <Route path="/admin/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
        <Route path="/admin/edit" element={<ProtectedRoute><EditPage /></ProtectedRoute>} />
        <Route path="/admin/exportar" element={<ProtectedRoute><ExportarPage /></ProtectedRoute>} />
        <Route path="/admin/historico" element={<ProtectedRoute><HistoricoPage /></ProtectedRoute>} />
        <Route path="/admin/historico-usuarios" element={<ProtectedRoute><HistoricoUsuariosPage /></ProtectedRoute>} />
        <Route path="/admin/indicadores" element={<ProtectedRoute><IndicadoresPage /></ProtectedRoute>} />
        <Route path="/admin/configuracoes" element={<ProtectedRoute><ConfiguracoesPage /></ProtectedRoute>} />

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
