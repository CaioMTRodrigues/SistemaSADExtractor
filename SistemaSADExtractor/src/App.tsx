import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import UploadPage from "./pages/UploadPage";
import EditPage from "./pages/EditPage";
import ExportarPage from "./pages/ExportarPage";
import HistoricoPage from "./pages/HistoricoPage";
import HistoricoUsuariosPage from "./pages/HistoricoUsuariosPage";
import IndicadoresPage from "./pages/IndicadoresPage";
import ConfiguracoesPage from "./pages/ConfiguracoesPage";


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route path="/cadastro/upload" element={<UploadPage />} />
        <Route path="/cadastro/edit" element={<EditPage />} />
        <Route path="/cadastro/exportar" element={<ExportarPage />} />
        <Route path="/cadastro/historico" element={<HistoricoPage />} />

        <Route path="/gestor/upload" element={<UploadPage />} />
        <Route path="/gestor/edit" element={<EditPage />} />
        <Route path="/gestor/exportar" element={<ExportarPage />} />
        <Route path="/gestor/historico" element={<HistoricoPage />} />
        <Route path="/gestor/historico-usuarios" element={<HistoricoUsuariosPage />} />
        <Route path="/gestor/indicadores" element={<IndicadoresPage />} />
        

        <Route path="/admin/upload" element={<UploadPage />} />
        <Route path="/admin/edit" element={<EditPage />} />
        <Route path="/admin/exportar" element={<ExportarPage />} />
        <Route path="/admin/historico" element={<HistoricoPage />} />
        <Route path="/admin/historico-usuarios" element={<HistoricoUsuariosPage />} />
        <Route path="/admin/indicadores" element={<IndicadoresPage />} />
        <Route path="/admin/configuracoes" element={<ConfiguracoesPage/>} />

        <Route path="*" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  );
}
