import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./FarmerDashboard.css";

const FarmerDashboard = ({ user, logout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/farmer/login", { replace: true });
  };

  return (
    <div className="farmer-dashboard">
      <nav className="navbar">
        <div className="nav-brand">🌾 Product Tracking using Blockchain</div>
        <div className="nav-links">
          <span className="welcome">Welcome, {user?.name}</span>
          <button onClick={handleLogout} className="logout-btn">LOGOUT</button>
        </div>
      </nav>

      <div className="dashboard">
        <div className="dashboard-header">
          <h1>Farmer Dashboard</h1>
          <p>Manage your products, orders, transportation, and earnings</p>
        </div>

        <div className="dashboard-actions">
          <div className="action-cards">

            <Link to="/farmer/add-product" className="action-card">
              <div className="card-icon">➕</div>
              <h3>Add New Product</h3>
              <p>Add a fresh product to your inventory</p>
            </Link>

            <Link to="/farmer/products" className="action-card">
              <div className="card-icon">📦</div>
              <h3>View Products</h3>
              <p>View & manage all your listed products</p>
            </Link>

            {/* ⭐ FIXED PATH HERE */}
            <Link to="/farmer/manage-orders" className="action-card">
              <div className="card-icon">🧾</div>
              <h3>Manage Orders</h3>
              <p>See retailer orders & mark them ready</p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard;
