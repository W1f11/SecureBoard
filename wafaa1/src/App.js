
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRegisterForm from "./components/LoginRegisterForm";
import Projects from "./components/Projects";
import AdminUsers from "./components/AdminUsers";



function App() {
  return (
    <BrowserRouter>
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
