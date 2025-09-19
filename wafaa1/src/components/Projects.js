import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";
import { Link } from "react-router-dom";


const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDesc, setEditDesc] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  // Username from DB
  const [user, setUser] = useState(null);
  // Fetch user info on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data);
      } catch (err) {
        setUser(null);
      }
    };
    if (token) fetchUser();
  }, [token]);

  // Responsive sidebar toggle
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 900) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch projects on mount
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get("http://localhost:8000/api/projects", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProjects(res.data);
      } catch (err) {
        console.error("Erreur chargement projets :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
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
            "Content-Type": "application/json",
          },
        }
      );
      setProjects((prev) => [...prev, res.data]);
      setNewTitle("");
      setNewDesc("");
      console.log("Projet créé :", res.data);
    } catch (err) {
      console.error(
        "Erreur création projet :",
        err.response?.data || err.message
      );
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
    <div className="projects-layout">
      <Link
        to="/admin/users"
        style={{
          display: 'inline-block',
          background: '#0ef',
          color: '#081b29',
          fontWeight: 'bold',
          fontSize: '1rem',
          padding: '8px 20px',
          borderRadius: '6px',
          margin: '16px 0',
          textAlign: 'center',
          minWidth: '120px',
          maxWidth: '200px',
          boxShadow: '0 2px 8px #0ef',
          cursor: 'pointer',
          textDecoration: 'none',
          border: 'none',
          zIndex: 5,
          position: 'relative',
          transition: 'background 0.2s, color 0.2s',
        }}
        onMouseOver={e => {
          e.target.style.background = '#081b29';
          e.target.style.color = '#0ef';
        }}
        onMouseOut={e => {
          e.target.style.background = '#0ef';
          e.target.style.color = '#081b29';
        }}
      >
        Admin Users
      </Link>

      {/* Burger Button for sidebar toggle on medium screens */}
      <button
        className="burger-btn"
        style={{
          // Only one display key
          display: window.innerWidth <= 900 ? "flex" : "none",
          borderRadius: "50%",
          background: "#081b29",
          color: "#0ef",
          border: "2px solid #0ef",
          width: "48px",
          height: "48px",
          minWidth: "48px",
          minHeight: "48px",
          fontSize: "2rem",
          position: "fixed",
          top: "24px",
          left: "24px",
          zIndex: 100,
          boxShadow: "0 2px 8px #0ef",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => setSidebarOpen((open) => !open)}
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: "100%",
          }}
        >
          {sidebarOpen ? "✖" : "☰"}
        </span>
      </button>

      {/* Sidebar horizontal overlay */}
      {sidebarOpen && window.innerWidth <= 900 && (
        <aside
          className="sidebar horizontal-sidebar"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "120px",
            background: "#081b29",
            color: "#fff",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 99,
            boxShadow: "0 2px 16px #0ef",
            padding: "0 32px",
          }}
        >
          <div
            className="sidebar-user"
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              marginLeft: "64px",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <div
              className="avatar-circle"
              style={{ marginBottom: 0, marginRight: 0 }}
            >
              {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
            <span
              className="username"
              style={{ marginTop: "8px", textAlign: "right", color: "#0ef" }}
            >
              {user?.name || "Utilisateur"}
            </span>
          </div>
          <button
            className="signout-btn"
            onClick={handleLogout}
            style={{
              alignSelf: "center",
              marginRight: "64px",
              marginLeft: "auto",
              justifySelf: "flex-end",
              marginBottom: "2.5em",
            }}
          >
            Sign Out
          </button>
        </aside>
      )}
      {/* Sidebar vertical for desktop */}
      {sidebarOpen && window.innerWidth > 900 && (
        <aside className="sidebar">
          <div className="sidebar-user">
            <div className="avatar-circle">
              {user?.name ? user.name.charAt(0).toUpperCase() : "?"}
            </div>
            <span className="username" style={{ color: "#0ef" }}>
              {user?.name || "Utilisateur"}
            </span>
          </div>
          <button className="signout-btn" onClick={handleLogout}>
            Sign Out
          </button>
        </aside>
      )}

      {/* Main Content */}
      <main
        className="main-content"
        style={{
          width: "100vw",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <h1
          className="projects-title"
          style={{ textAlign: "center", width: "100%" }}
        >
          Projects
        </h1>
        <form
          className="project-form"
          onSubmit={handleCreate}
          style={{
            width: "33vw",
            minWidth: "280px",
            maxWidth: "400px",
            margin: "0 auto 32px auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxSizing: "border-box",
          }}
        >
          <h3>New Project</h3>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            required
            style={{ width: "100%" }}
          />
          <textarea
            placeholder="Description"
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            required
            style={{ width: "100%", minHeight: "80px" }}
          ></textarea>
          <button type="submit">Create</button>
        </form>

        {/* Projects Grid */}
        <div
          className="projects-grid"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "24px",
            justifyContent: "center",
          }}
        >
          {loading ? (
            <p>Loading projects...</p>
          ) : projects.length === 0 ? (
            <p>No projects yet.</p>
          ) : (
            projects.map((project) => (
              <div className="project-card" key={project.id}>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                </div>
                <div className="project-actions">
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </button>
                  <button
                    className="edit-btn"
                    onClick={() => {
                      setEditId(project.id);
                      setEditTitle(project.title);
                      setEditDesc(project.description);
                    }}
                  >
                    Edit
                  </button>
                </div>
                {editId === project.id && (
                  <form className="edit-form" onSubmit={handleEdit}>
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
                    <button type="submit">Save</button>
                    <button type="button" onClick={() => setEditId(null)}>
                      Cancel
                    </button>
                  </form>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
};

export default Projects;
