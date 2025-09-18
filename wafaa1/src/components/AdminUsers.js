import React, { useEffect, useState } from "react";
import axios from "axios";

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
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get("http://localhost:8000/api/users", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers(res.data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    await axios.post(
      "http://localhost:8000/api/users",
      { name, email, password, role },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setName(""); setEmail(""); setPassword(""); setRole("user");
    fetchUsers();
  };

  const handleEdit = (user) => {
    setEditId(user.id);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.roles[0]?.name || "user");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    await axios.put(
      `http://localhost:8000/api/users/${editId}`,
      { name: editName, email: editEmail, role: editRole },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setEditId(null);
    fetchUsers();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    await axios.delete(`http://localhost:8000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Gestion des utilisateurs</h2>
      <form onSubmit={handleCreate} style={{ marginBottom: 20 }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Nom" required />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <input value={password} onChange={e => setPassword(e.target.value)} placeholder="Mot de passe" required type="password" />
        <select value={role} onChange={e => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <button type="submit">Ajouter</button>
      </form>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.roles && user.roles.length > 0 ? user.roles[0].name : "-"}</td>
              <td>
                <button onClick={() => handleEdit(user)}>Modifier</button>
                <button onClick={() => handleDelete(user.id)} style={{ marginLeft: 8 }}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {editId && (
        <form onSubmit={handleUpdate} style={{ marginTop: 20 }}>
          <h3>Modifier utilisateur</h3>
          <input value={editName} onChange={e => setEditName(e.target.value)} required />
          <input value={editEmail} onChange={e => setEditEmail(e.target.value)} required />
          <select value={editRole} onChange={e => setEditRole(e.target.value)}>
            <option value="user">User</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
          <button type="submit">Enregistrer</button>
          <button type="button" onClick={() => setEditId(null)} style={{ marginLeft: 8 }}>Annuler</button>
        </form>
      )}
    </div>
  );
};

export default AdminUsers;
