import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { farmerAPI } from "../services/api";

const FarmerManageOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load farmer from localStorage (correct keys)
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedType = localStorage.getItem("userType");
    const auth = localStorage.getItem("isAuthenticated");

    if (!auth || storedType !== "farmer" || !storedUser) {
      navigate("/farmer/login");
      return;
    }

    loadOrders(storedUser.id);
  }, [navigate]);

  const loadOrders = async (farmerId) => {
    try {
      const res = await farmerAPI.getFarmerOrders(farmerId);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error loading farmer orders:", err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="loading">⏳ Loading orders...</p>;

  return (
    <div className="farmer-orders-container">
      
      {/* ⭐ BACK BUTTON HERE ⭐ */}
      <button
        onClick={() => navigate("/farmer/dashboard")}
        style={{
          background: "#4CAF50",
          color: "#fff",
          padding: "8px 14px",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          fontSize: "16px",
          marginBottom: "15px"
        }}
      >
        ⬅ Back to Dashboard
      </button>

      <h1>📜 Manage Orders</h1>
      <p>Orders placed on your products</p>

      {orders.length === 0 ? (
        <p className="empty">No orders yet.</p>
      ) : (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Date</th>
              <th>Total</th>
              <th>Retailer</th>
              <th>Status</th>
              <th>View</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>₹{order.totalAmount?.toFixed(2)}</td>
                <td>{order.retailer?.storeName || order.retailer?.name || "N/A"}</td>
                <td>{order.status}</td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() => navigate(`/farmer/assign-transport/${order.id}`)}
                  >
                    🔍 View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FarmerManageOrders;
