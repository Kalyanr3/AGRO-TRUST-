import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";   // FIXED
import { orderAPI } from "../services/api";
import "./TransportDashboard.css";


const TransportDashboard = () => {
  const saved = JSON.parse(localStorage.getItem("transporter"));
  const navigate = useNavigate();

  // ✅ FIX: transporterId always comes from saved.id
  const transporterId = saved?.id || null;

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!transporterId) {
      console.error("❌ No transporterId found in localStorage");
      return;
    }
    loadAssignedOrders(transporterId);
  }, [transporterId]);

  const loadAssignedOrders = async (id) => {
    try {
      const res = await orderAPI.getOrdersForTransporter(id);  // ✅ FIX: correct API
      setOrders(res.data || []);
    } catch (err) {
      console.error("❌ Failed to load transporter orders:", err);
    }
  };

  const updateStatus = async (orderId, status) => {
    try {
      const res = await orderAPI.updateTransportStatus(orderId, status);

      setOrders((prev) =>
        prev.map((o) => (o.orderId === orderId ? { ...o, ...res.data } : o))
      );
    } catch (err) {
      console.error("❌ Failed to update status:", err);
      alert("Failed to update delivery status");
    }
  };

  const handleBack = () => navigate("/transport/login");

  if (!transporterId) {
    return (
      <div className="transport-dashboard">
        <h2>No transporter logged in!</h2>
        <button className="back-btn" onClick={handleBack}>
          ⬅ Back to Login
        </button>
      </div>
    );
  }

  return (
    <>
      <nav className="navbar">
        <div className="nav-brand">AGRO-TRUST!!</div>
      </nav>

      <div className="transport-dashboard">
        <button className="back-btn" onClick={handleBack}>⬅ Back</button>

        <h1>🚚 TRANSPORTER DASHBOARD</h1>
        <h3>Welcome, {saved?.name}</h3>

        {orders.length === 0 ? (
          <p className="no-orders">No assigned deliveries yet.</p>
        ) : (
          <div className="orders-list">
            {orders.map((order) => (
              <div className="order-card" key={order.orderId}>
                <h3>Order #{order.orderId}</h3>
                <p><b>Status:</b> {order.status}</p>
                <p><b>Farmer:</b> {order.farmerName || "Unknown"}</p>
                <p><b>Total Amount:</b> ₹{order.totalAmount}</p>
                <p><b>Vehicle:</b> {order.vehicleNo || "-"}</p>
                <p><b>Driver:</b> {order.driverName || "-"}</p>

                <div className="actions">
                  {order.status === "ASSIGNED_TO_TRANSPORTER" && (
                    <button
                      className="pickup-btn"
                      onClick={() =>
                        updateStatus(order.orderId, "OUT_FOR_DELIVERY")
                      }
                    >
                      🚚 Mark Picked Up
                    </button>
                  )}

                  {order.status !== "DELIVERED" && (
                    <button
                      className="deliver-btn"
                      onClick={() =>
                        updateStatus(order.orderId, "DELIVERED")
                      }
                    >
                      ✔ Mark Delivered
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default TransportDashboard;
