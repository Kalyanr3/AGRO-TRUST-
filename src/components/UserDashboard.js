import React from "react";
import { useNavigate } from "react-router-dom";
import "./UserDashboard.css"; // ← Make sure this file exists

export default function UserDashboard({ user, logout }) {
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">

      {/* HEADER SECTION */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">Welcome, {user?.name}</h2>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      {/* CARD SECTION */}
      <div className="dashboard-card">
        <h3 className="card-title">Start Shopping</h3>
        <p className="card-subtitle">
          Browse trusted retailers and explore fresh products.
        </p>

        <button
          className="action-btn"
          onClick={() => navigate("/user/retailers")}
        >
          View Retailers
        </button>
      </div>
    </div>
  );
}
