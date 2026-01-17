import React, { useEffect, useState } from "react";
import { retailerAPI } from "../services/api";
import { Link, useNavigate } from "react-router-dom";
import "./RetailerDashboard.css";

const RetailerDashboard = () => {
  const navigate = useNavigate();

  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [retailer, setRetailer] = useState(null);

  // Load retailer from localStorage
  useEffect(() => {
    let storedRetailer = null;
    try {
      const raw = localStorage.getItem("retailer");
      storedRetailer = raw ? JSON.parse(raw) : null;
    } catch (e) {
      storedRetailer = null;
    }

    if (!storedRetailer) {
      navigate("/retailer/login");
      return;
    }
    setRetailer(storedRetailer);
  }, [navigate]);

  // Load farmers with products
  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const res = await retailerAPI.getAllFarmersWithProducts();
        const data = res?.data || [];

        data.sort((a, b) => {
          const aHas = a.products?.length > 0;
          const bHas = b.products?.length > 0;
          return aHas === bHas ? 0 : aHas ? -1 : 1;
        });

        setFarmers(data);
      } catch (err) {
        console.error("Error loading farmers:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("retailer");
    localStorage.removeItem("retailerToken");
    navigate("/retailer/login", { replace: true });
  };

  if (loading) return <p className="loading">🌾 Loading farmers...</p>;

  return (
    <div className="dashboard">
      {/* ---------- HEADER ---------- */}
      <header className="dashboard-header-bar">
        <div className="logo">🌾 AGRO-TRUST!!</div>

        <nav className="nav-links">
          <Link to="/retailer/orders" className="nav-link">📦 MY ORDERS</Link>
          <Link to="/retailer/cart" className="nav-link">🛍 CART</Link>

          <span className="welcome-text">
            Welcome, <b>{retailer?.storeName || retailer?.name}</b>
          </span>

          <button onClick={handleLogout} className="logout-btn">LOGOUT</button>
        </nav>
      </header>

      {/* ---------- TITLE ---------- */}
      <section className="dashboard-title-section">
        <h1>RETAILER DASHBOARD</h1>
        <p>Click a farmer to view their available products.</p>
        <hr className="section-divider" />
      </section>

      {/* ---------- FARMERS LIST ---------- */}
      <h2 className="section-label">👨‍🌾 FARMERS</h2>

      <div className="farmer-list">
        {farmers.length === 0 ? (
          <p>No farmers available.</p>
        ) : (
          farmers.map((farmer) => (
            <div
              key={farmer.id}
              className="farmer-card clickable"
              onClick={() => navigate(`/retailer/farmer/${farmer.id}`)}
            >
              <h3 className="farmer-name">{farmer.name}</h3>
              <p><b>📞 Phone:</b> {farmer.phone}</p>
              <p><b>📍 Address:</b> {farmer.address || "N/A"}</p>

              <p className="product-count">
                {farmer.products?.length > 0
                  ? `🧺 ${farmer.products.length} product(s)`
                  : "🚫 No products available"}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RetailerDashboard;
