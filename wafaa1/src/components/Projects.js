import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const navigate = useNavigate();
  
  const token = localStorage.getItem("token");

  

  // Charger les projets depuis Laravel
  useEffect(() => {
    if (token) {
      axios
        .get("http://127.0.0.1:8000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          setProjects(res.data);
        })
        .catch((err) => {
          console.error("Erreur chargement projets:", err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token]);

  // CREATE
  const handleCreate = async (e) => {
  e.preventDefault();

  if (!newTitle.trim() || !newDesc.trim()) {
    alert("Veuillez remplir le titre et la description.");
    return;
  }

  try {
    const res = await axios.post(
      "http://localhost:8000/api/projects",
      { title: newTitle.trim(), description: newDesc.trim() },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json", // Assure que Laravel reçoit du JSON
        },
      }
    );

    // Ajout du nouveau projet à la liste
    setProjects((prev) => [...prev, res.data]);

    // Réinitialisation des champs
    setNewTitle("");
    setNewDesc("");

    console.log("Projet créé :", res.data);
  } catch (err) {
    console.error("Erreur création projet :", err.response?.data || err.message);

    // Affiche le message exact de Laravel si possible
    if (err.response?.data?.message) {
      alert("Erreur création projet : " + err.response.data.message);
    } else {
      alert("Erreur création projet. Vérifiez votre token et les champs.");
    }
  }
};

  // UPDATE
  const handleEdit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `http://localhost:8000/api/projects/${editId}`,
        { title: editTitle, description: editDesc },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(projects.map((p) => (p.id === editId ? res.data : p)));
      setEditId(null);
      setEditTitle("");
      setEditDesc("");
    } catch (err) {
      alert("Erreur modification projet");
    }
  };

  // DELETE
  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce projet ?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((p) => p.id !== id));
    } catch (err) {
      alert("Erreur suppression projet");
    }
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>📂 Projets</h1>
      <button onClick={handleLogout}>🚪 Déconnexion</button>

      {/* Formulaire création projet (toujours affiché) */}
      <form onSubmit={handleCreate} style={{ marginTop: "20px" }}>
        <h3>➕ Nouveau projet</h3>
        <input
          type="text"
          placeholder="Titre"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <br />
        <textarea
          placeholder="Description"
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
          required
        ></textarea>
        <br />
        <button type="submit">✅ Créer</button>
      </form>

      {/* Liste des projets */}
      <div style={{ marginTop: "20px" }}>
        {loading ? (
          <p>Chargement des projets...</p>
        ) : projects.length === 0 ? (
          <p>Aucun projet pour l’instant.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} style={{ marginBottom: "10px" }}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <button onClick={() => handleDelete(project.id)}>❌ Supprimer</button>
              <button
                onClick={() => {
                  setEditId(project.id);
                  setEditTitle(project.title);
                  setEditDesc(project.description);
                }}
              >
                ✏️ Modifier
              </button>

              {editId === project.id && (
                <form onSubmit={handleEdit}>
                  <input
                    type="text"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    required
                  />
                  <textarea
                    value={editDesc}
                    onChange={(e) => setEditDesc(e.target.value)}
                    required
                  ></textarea>
                  <button type="submit">💾 Sauvegarder</button>
                  <button
                    type="button"
                    onClick={() => setEditId(null)}
                    style={{ marginLeft: "5px" }}
                  >
                    ❌ Annuler
                  </button>
                </form>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Projects;
