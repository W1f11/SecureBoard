import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginRegisterForm from "./components/LoginRegisterForm"; 
import Projects from "./components/Projects";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginRegisterForm />} />
        <Route path="/projects" element={<Projects />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
