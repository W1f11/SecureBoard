import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Récupérer le token du localStorage
  const token = localStorage.getItem("token");

  // Redirection vers login si pas de token
  useEffect(() => {
    if (!token) {
      navigate("/projects"); // ← corrige ici : pas /projects
    }
  }, [token, navigate]);

  // Charger les projets depuis Laravel
  useEffect(() => {
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("Projets reçus:", res.data); // 🔹 debug
          setProjects(res.data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Erreur chargement projets:", err);
          setLoading(false);
        });
    }
  }, [token]);

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  if (loading) {
  // Projets fictifs en attendant le backend
  const fakeProjects = [
    { id: 1, title: "🌌 Exploration Spatiale", description: "Un projet sur les étoiles et galaxies.", user: { name: "Admin" } },
    { id: 2, title: "🍕 Application de Restaurant", description: "Commander vos plats préférés en ligne.", user: { name: "Demo User" } },
    { id: 3, title: "📚 Gestion Bibliothèque", description: "Système de gestion des emprunts de livres.", user: { name: "Test User" } },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <h1>📂 Projets (Mode Démo)</h1>
      <p>Chargement des vrais projets...</p>
      <div>
        {fakeProjects.map((project) => (
          <div
            key={project.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "5px",
              background: "#f9f9f9"
            }}
          >
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <small>👤 {project.user.name}</small>
          </div>
        ))}
      </div>
    </div>
  );
}

};

export default Projects;
