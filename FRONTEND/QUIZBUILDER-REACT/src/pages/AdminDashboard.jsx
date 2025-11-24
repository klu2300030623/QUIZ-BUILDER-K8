import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export default function AdminDashboard() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!user) navigate("/login");
    else if (user.role !== "ADMIN") navigate(`/${user.role.toLowerCase()}/dashboard`);
    else fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/auth/users`);
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await axios.delete(`${API_URL}/api/auth/users/${id}`);
        setUsers(users.filter((u) => u.id !== id));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = async (u) => {
    const newName = prompt("Enter new name:", u.name);
    if (newName && newName !== u.name) {
      try {
        const updatedUser = { ...u, name: newName };
        await axios.put(`${API_URL}/api/auth/users/${u.id}`, updatedUser);
        setUsers(users.map((user) => (user.id === u.id ? updatedUser : user)));
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!user) return null;

  return (
    <div className="admin-container">
      {/* Embedded CSS */}
      <style>{`
        .admin-container {
          padding: 30px;
          font-family: "Poppins", sans-serif;
          background-color: #f7f9fc;
          min-height: 100vh;
        }

        .admin-heading {
          color: #2c3e50;
          font-size: 28px;
          margin-bottom: 10px;
        }

        .welcome-text {
          font-size: 18px;
          color: #555;
          margin-bottom: 25px;
        }

        .table-container {
          background: white;
          border-radius: 12px;
          padding: 20px;
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        }

        .styled-table {
          width: 100%;
          border-collapse: collapse;
        }

        .styled-table th,
        .styled-table td {
          padding: 12px 15px;
          text-align: left;
        }

        .styled-table thead {
          background-color: #0077b6;
          color: white;
        }

        .styled-table tr {
          border-bottom: 1px solid #ddd;
        }

        .styled-table tr:hover {
          background-color: #f1f7ff;
        }

        .edit-btn,
        .delete-btn {
          border: none;
          padding: 6px 12px;
          margin-right: 6px;
          border-radius: 6px;
          cursor: pointer;
          font-weight: 500;
          transition: 0.3s;
        }

        .edit-btn {
          background-color: #4caf50;
          color: white;
        }

        .delete-btn {
          background-color: #e74c3c;
          color: white;
        }

        .edit-btn:hover {
          background-color: #45a049;
        }

        .delete-btn:hover {
          background-color: #c0392b;
        }

        .no-data {
          text-align: center;
          color: #777;
          padding: 20px;
        }
      `}</style>

      <h2 className="admin-heading"> Admin Dashboard</h2>
      <p className="welcome-text">
        Welcome, <strong>{user.name}</strong>
      </p>

      <div className="table-container">
        <h3>Manage Users</h3>
        <table className="styled-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.length ? (
              users.map((u) => (
                <tr key={u.id}>
                  <td>{u.id}</td>
                  <td>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.role}</td>
                  <td>
                    <button className="edit-btn" onClick={() => handleEdit(u)}>
                       Edit
                    </button>
                    <button className="delete-btn" onClick={() => handleDelete(u.id)}>
                       Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="no-data">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
