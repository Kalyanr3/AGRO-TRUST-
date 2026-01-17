import React, { useEffect, useState } from "react";
import { orderAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./RetailerOrders.css";

const RetailerOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [retailer, setRetailer] = useState(null);

  // Load Retailer + Orders
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("retailer"));
    if (!stored) {
      navigate("/retailer/login");
      return;
    }

    setRetailer(stored);
    loadOrders(stored.id);
  }, [navigate]);

  // Fetch orders from API
  const loadOrders = async (retailerId) => {
    try {
      const res = await orderAPI.getRetailerOrders(retailerId);
      setOrders(res.data || []);
    } catch (err) {
      console.error("Error loading orders:", err);
    }
  };

  // Format order date
  const formatDate = (dateString) => {
    if (!dateString) return "Invalid Date";
    const d = new Date(dateString);
    return d.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="orders-page">

      {/* Back Button */}
      <button
        className="back-btn"
        onClick={() => navigate("/retailer/dashboard")}
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <h1 className="orders-title">📦 MY ORDERS</h1>

      <p className="welcome-text">
        Welcome back, <b>{retailer?.storeName || retailer?.name}</b>
      </p>

      {/* Orders Table */}
      <table className="orders-table">
        <thead>
          <tr>
            <th>ORDER ID</th>
            <th>DATE</th>
            <th>TOTAL</th>
            <th>PAYMENT METHOD</th>
            <th>PAYMENT STATUS</th>
            <th>VIEW</th>
          </tr>
        </thead>

        <tbody>
          {orders.length === 0 ? (
            <tr>
              <td colSpan="6" className="no-orders">
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((o) => (
              <tr key={o.id}>
                <td>{o.id}</td>

                <td>{formatDate(o.orderDate || o.createdAt)}</td>

                <td>₹{Number(o.totalAmount || 0).toFixed(2)}</td>

                <td>{o.paymentMethod || o.payment_mode || "-"}</td>

                <td>
                  {o.status === "PAID" ? (
                    <span className="status paid">PAID</span>
                  ) : (
                    <span className="status pending">PENDING</span>
                  )}
                </td>

                <td>
                  <button
                    className="view-btn"
                    onClick={() =>
                      navigate(`/order-details/${o.id}`, {
                        state: { order: o },
                      })
                    }
                  >
                    🔍 VIEW
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RetailerOrders;
