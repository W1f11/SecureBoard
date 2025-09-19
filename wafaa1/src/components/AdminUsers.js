import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../App.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [editId, setEditId] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth > 900);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

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

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      setUsers([]);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:8000/api/users",
        { name, email, password, role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      fetchUsers();
    } catch (err) {
      alert("Erreur création utilisateur");
    }
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.roles[0]?.name || "user");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/api/users/${editId}`,
        { name: editName, email: editEmail, role: editRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditId(null);
      fetchUsers();
    } catch (err) {
      alert("Erreur modification utilisateur");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchUsers();
    } catch (err) {
      alert("Erreur suppression utilisateur");
    }
  };

  // Déconnexion
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="projects-layout">
      {/* Burger Button for sidebar toggle on medium screens */}
      <button
        className="burger-btn"
        style={{
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
          Gestion des utilisateurs
        </h1>
        <form
          onSubmit={handleCreate}
          className="project-form"
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
          <h3>Nouvel utilisateur</h3>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nom"
            required
            style={{ width: "100%" }}
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={{ width: "100%" }}
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            type="password"
            style={{ width: "100%" }}
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px",
              borderRadius: "6px",
              border: "2px solid #0ef",
              fontSize: "1rem",
              margin: "8px 0",
              background: "#fff",
              color: "#081b29",
              boxSizing: "border-box",
              outline: "none",
              transition: "border 0.2s, box-shadow 0.2s",
            }}
            onFocus={(e) => {
              e.target.style.border = "2px solid #081b29";
              e.target.style.boxShadow = "0 2px 8px #0ef";
            }}
            onBlur={(e) => {
              e.target.style.border = "2px solid #0ef";
              e.target.style.boxShadow = "none";
            }}
          >
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Ajouter</button>
        </form>

        {/* Users Table */}
        <div
          className="projects-grid"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <table
            className="admin-users-table"
            style={{
              width: "80%",
              margin: "0 auto",
              background: "#081b29",
              color: "#fff",
              borderRadius: "16px",
              boxShadow: "0 0 25px #0ef",
              border: "2px solid #0ef",
              overflow: "hidden",
            }}
          >
            <thead>
              <tr style={{ background: "#0ef", color: "#081b29" }}>
                <th
                  style={{
                    padding: "12px 8px",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    border: "none",
                  }}
                >
                  Nom
                </th>
                <th
                  style={{
                    padding: "12px 8px",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    border: "none",
                  }}
                >
                  Email
                </th>
                <th
                  style={{
                    padding: "12px 8px",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    border: "none",
                  }}
                >
                  Rôle
                </th>
                <th
                  style={{
                    padding: "12px 8px",
                    fontWeight: 700,
                    fontSize: "1.1rem",
                    border: "none",
                  }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  style={{
                    background: "rgba(8,27,41,0.95)",
                    color: "#fff",
                    borderBottom: "1.5px solid #0ef",
                    transition: "background 0.18s",
                  }}
                  onMouseOver={(e) =>
                    (e.currentTarget.style.background = "#0ef33")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.background = "rgba(8,27,41,0.95)")
                  }
                >
                  <td style={{ padding: "10px 8px", border: "none" }}>
                    {user.name}
                  </td>
                  <td style={{ padding: "10px 8px", border: "none" }}>
                    {user.email}
                  </td>
                  <td style={{ padding: "10px 8px", border: "none" }}>
                    {user.roles && user.roles.length > 0
                      ? user.roles[0].name
                      : "-"}
                  </td>
                  <td style={{ padding: "10px 8px", border: "none" }}>
                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(user)}
                      style={{ marginRight: 8 }}
                    >
                      Modifier
                    </button>
                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(user.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {editId && (
            <form
              onSubmit={handleUpdate}
              className="edit-form"
              style={{
                marginTop: 20,
                width: "33vw",
                minWidth: "280px",
                maxWidth: "400px",
              }}
            >
              <h3>Modifier utilisateur</h3>
              <input
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                required
                style={{ width: "100%" }}
              />
              <input
                value={editEmail}
                onChange={(e) => setEditEmail(e.target.value)}
                required
                style={{ width: "100%" }}
              />
              <select
                value={editRole}
                onChange={(e) => setEditRole(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "2px solid #0ef",
                  fontSize: "1rem",
                  margin: "8px 0",
                  background: "#fff",
                  color: "#081b29",
                  boxSizing: "border-box",
                  outline: "none",
                  transition: "border 0.2s, box-shadow 0.2s",
                }}
                onFocus={(e) => {
                  e.target.style.border = "2px solid #081b29";
                  e.target.style.boxShadow = "0 2px 8px #0ef";
                }}
                onBlur={(e) => {
                  e.target.style.border = "2px solid #0ef";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="user">User</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit">Enregistrer</button>
              <button
                type="button"
                onClick={() => setEditId(null)}
                style={{ marginLeft: 8 }}
              >
                Annuler
              </button>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminUsers;