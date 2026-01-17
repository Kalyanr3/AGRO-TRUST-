// src/components/OrderDetails.js
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { orderAPI } from "../services/api";
import "./OrderDetails.css";

const fmtAmt = (v) =>
  v == null ? "—" : Number(v).toLocaleString("en-IN", { minimumFractionDigits: 2 });

const safe = (obj, ...paths) => {
  for (const p of paths) {
    if (obj == null) break;
    if (typeof p === "function") {
      try {
        const val = p(obj);
        if (val !== undefined) return val;
      } catch {}
    } else if (obj[p] !== undefined && obj[p] !== null) {
      return obj[p];
    }
  }
  return undefined;
};

const OrderDetails = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();

  const [order, setOrder] = useState(state?.order || null);
  const [loading, setLoading] = useState(!state?.order);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (order) return;
    if (!id) return;

    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await orderAPI.getOrderDetails(id);
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="od-loading">
        <div className="od-loading-card">Loading order...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="od-loading">
        <div className="od-loading-card">
          <h3>⚠ Error</h3>
          <p>{error || "Order not found"}</p>
          <button onClick={() => navigate(-1)}>Close</button>
        </div>
      </div>
    );
  }

  const orderId = order.orderId ?? order.id;
  const createdAt = order.createdAt || order.createdAtTime || order.createdOn;

  const dateStr = createdAt
    ? new Date(createdAt).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : "—";

  const items = Array.isArray(order.items)
    ? order.items
    : order.orderItems || order.itemsDto || [];

  const mapped = items.map((it) => {
    const productName =
      safe(it, "productName", "name", (o) => o.product?.name, (o) => o.itemName) ||
      "Unknown product";

    const quantity =
      safe(it, "quantity", "qty", "count", (o) => o.quantityOrdered) ?? 0;

    const price =
      safe(it, "price", "unitPrice", "productPrice", (o) => o.product?.price) ?? 0;

    const total =
      safe(it, "total", "totalPrice", "lineTotal") ||
      Number(price) * Number(quantity);

    return { productName, quantity, price, total };
  });

  /* ===== Retailer Confirmation Function ===== */
  const handleRetailerConfirm = async (confirmed) => {
    try {
      await orderAPI.retailerConfirm(orderId, confirmed);
      alert(confirmed ? "✔ Delivery Confirmed!" : "❌ Delivery Rejected!");
      window.location.reload();
    } catch (err) {
      console.error("Retailer confirmation failed:", err);
      alert("Failed to update confirmation.");
    }
  };

  return (
    <div className="od-container">
      <div className="od-card">
        <div className="od-header">
          <h1 className="od-title">🧾 Order #{orderId}</h1>

          <div className="od-meta">
            <div><b>Date:</b> {dateStr}</div>
            <div><b>Retailer:</b> {order.retailerName ?? order.retailer?.storeName ?? order.retailer?.name ?? "—"}</div>
            <div><b>Farmer:</b> {order.farmerName ?? (order.farmerId ? `Farmer #${order.farmerId}` : "—")}</div>
            <div><b>Payment Method:</b> {order.paymentMethod ?? "—"}</div>

            <div>
              <b>Payment Status:</b>{" "}
              <span className={`od-status ${order.paymentStatus === "PAID" ? "paid" : "pending"}`}>
                {order.paymentStatus ?? "PENDING"}
              </span>
            </div>

            <div style={{ marginTop: "6px" }}>
              <b>Delivery Status:</b>{" "}
              <span
                className={`od-status ${
                  order.status === "DELIVERED"
                    ? "paid"
                    : order.status === "OUT_FOR_DELIVERY"
                    ? "shipping"
                    : order.status === "ASSIGNED_TO_TRANSPORTER"
                    ? "assigned"
                    : "pending"
                }`}
              >
                {order.status === "PROCESSING" && "Not Assigned"}
                {order.status === "ASSIGNED_TO_TRANSPORTER" && "Assigned"}
                {order.status === "OUT_FOR_DELIVERY" && "Out for Delivery"}
                {order.status === "DELIVERED" && "Delivered"}
              </span>
            </div>

            {["OUT_FOR_DELIVERY", "DELIVERED"].includes(order.status) && (
              <div className="od-transporter-box">
                <br></br>
                <h3>🚚 TRANSPORTER DETAILS</h3>
                <p><b>Transporter ID:</b> {order.transporterId || "—"}</p>
                <p><b>Vehicle Type:</b> {order.vehicleType || "—"}</p>
                <p><b>Vehicle Number:</b> {order.vehicleNo || "—"}</p>
                <p><b>Driver Name:</b> {order.driverName || "—"}</p>
                <p><b>Driver Contact:</b> {order.driverContact || "—"}</p>
              </div>
            )}
          </div>
        </div>

        <h2 className="od-subtitle">🛒 PRODUCTS</h2>

        {/* Products Table */}
        <div className="od-table-wrap">
          <table className="od-table">
            <thead>
              <tr>
                <th style={{ textAlign: "left" }}>Product</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {mapped.length === 0 ? (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: 18 }}>
                    No items
                  </td>
                </tr>
              ) : (
                mapped.map((it, idx) => (
                  <tr key={`${it.productName}-${idx}`}>
                    <td style={{ textAlign: "left" }}>{it.productName}</td>
                    <td>{it.quantity}</td>
                    <td>₹{fmtAmt(it.price)}</td>
                    <td>₹{fmtAmt(it.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* ================= RETAILER CONFIRM BOX ================= */}
        {order.status === "DELIVERED" && order.retailerConfirmed === null && (
          <div className="od-confirm-box">
            <p className="od-confirm-title">Did you receive the delivery?</p>

            <div className="od-confirm-buttons">
              <button 
                className="od-yes"
                onClick={() => handleRetailerConfirm(true)}
              >
                ✔ Yes, Received
              </button>

              <button 
                className="od-no"
                onClick={() => handleRetailerConfirm(false)}
              >
                ✖ No, Not Received
              </button>
            </div>
          </div>
        )}
        {/* ====================================================== */}

        <div style={{ marginTop: 20 }}>
          <button className="od-back-btn" onClick={() => navigate(-1)}>
            ← Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;