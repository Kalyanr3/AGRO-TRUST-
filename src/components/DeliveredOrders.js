import React, { useEffect, useState } from "react";
import { orderAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./DeliveredOrders.css";

const DeliveredOrders = () => {
  const navigate = useNavigate();
  const retailer = JSON.parse(localStorage.getItem("retailer"));
  const retailerId = retailer?.id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // ------------------------------
  // Load delivered orders
  // ------------------------------
  useEffect(() => {
    if (!retailerId) {
      alert("Please log in as retailer.");
      navigate("/retailer/login");
      return;
    }
    loadDeliveredOrders();
  }, [retailerId, navigate]);

  const loadDeliveredOrders = async () => {
    try {
      const res = await orderAPI.getRetailerDeliveredOrders(retailerId);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Failed to fetch delivered orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // Confirm Receipt
  // ------------------------------
  const handleConfirm = async (orderId) => {
    try {
      await orderAPI.confirmReceipt(orderId);
      alert("✔ Delivery confirmed!");

      // Remove from list
      setOrders((prev) => prev.filter((o) => o.id !== orderId));
    } catch (err) {
      console.error("Error confirming receipt:", err);
      alert("❌ Failed to confirm delivery");
    }
  };

  if (loading) return <p className="loading">Loading delivered orders...</p>;

  return (
    <div className="delivered-orders-page">

      <div className="header-bar">
        <button className="back-btn" onClick={() => navigate("/retailer/dashboard")}>
          ← Back
        </button>
        <h2>✔ Delivered Orders</h2>
      </div>

      {orders.length === 0 ? (
        <p className="no-orders">No delivered orders pending confirmation.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div className="order-card" key={order.id}>
              <h3>Order #{order.id}</h3>

              <p><b>Total:</b> ₹{order.totalAmount}</p>
              <p><b>Delivered On:</b> {order.deliveredDate?.replace("T", " ")}</p>

              <p><b>Status:</b> 
                <span className="status delivered">DELIVERED</span>
              </p>

              <button
                onClick={() => handleConfirm(order.id)}
                className="confirm-btn"
              >
                ✔ Confirm Receipt
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveredOrders;