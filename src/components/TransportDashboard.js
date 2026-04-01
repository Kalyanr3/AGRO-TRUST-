import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../services/api";
import "./TransportDashboard.css";

const TransportDashboard = () => {
  const saved = JSON.parse(localStorage.getItem("transporter"));
  const navigate = useNavigate();

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
      const res = await orderAPI.getOrdersForTransporter(id);
      setOrders(res.data || []);
    } catch (err) {
      console.error("❌ Failed to load transporter orders:", err);
    }
  };

  // 🚚 PICKUP (NO EMAIL)
  const markPickedUp = async (orderId) => {
    try {
      await orderAPI.updateTransportStatus(orderId, "OUT_FOR_DELIVERY");
      loadAssignedOrders(transporterId);
    } catch (err) {
      console.error("❌ Pickup failed:", err);
      alert("❌ Failed to mark pickup");
    }
  };

  // 📦 DELIVERY (EMAIL WILL SEND)
  const markDelivered = async (orderId) => {
    try {
      await orderAPI.confirmDelivery(orderId);
      alert("✅ Delivery confirmed\n📧 Email sent to Retailer & Farmer");
      loadAssignedOrders(transporterId);
    } catch (err) {
      console.error("❌ Delivery failed:", err);
      alert("❌ Failed to confirm delivery");
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
        <div className="nav-brand">AGRO-TRUST : AN AGRICULTURE PRODUCT SUPPLY CHAIN MANAGEMENT USING BLOCKCHAIN AND IOT </div>
      </nav>

      <div className="transport-dashboard">
        <button className="back-btn" onClick={handleBack}>
          ⬅ Back
        </button>

        <h1>🚚 Transporter Dashboard</h1>
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
                  {/* PICKUP */}
                  {order.status === "ASSIGNED_TO_TRANSPORTER" && (
                    <button
                      className="pickup-btn"
                      onClick={() => markPickedUp(order.orderId)}
                    >
                      🚚 Mark Picked Up
                    </button>
                  )}

                  {/* DELIVERY */}
                  {order.status === "OUT_FOR_DELIVERY" && (
                    <button
                      className="deliver-btn"
                      onClick={() => {
                        if (
                          window.confirm(
                            "Confirm delivery?\nThis will notify Retailer & Farmer."
                          )
                        ) {
                          markDelivered(order.orderId);
                        }
                      }}
                    >
                      ✔ Mark Delivered
                    </button>
                  )}

                  {/* DELIVERED */}
                  {order.status === "DELIVERED" && (
                    <span className="delivered-badge">✅ Delivered</span>
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
