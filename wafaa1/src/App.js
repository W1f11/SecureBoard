
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRegisterForm from "./components/LoginRegisterForm";
import Projects from "./components/Projects";
import AdminUsers from "./components/AdminUsers";
import Notifications from "./components/Notifications"; // ← ajoute ceci



function App() {
  return (
    <BrowserRouter>
    <div style={{ position: "fixed", top: 10, right: 10, zIndex: 30 }}>
        <Notifications />
      </div>
      <Routes>
        <Route path="/" element={<LoginRegisterForm />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/admin/users" element={<AdminUsers />} />
      </Routes>
    </BrowserRouter>
  );
}
//ghugukjfhkdfk

export default App;
