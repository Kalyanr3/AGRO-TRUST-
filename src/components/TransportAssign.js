import React, { useEffect, useState } from "react";
import { orderAPI, transportAPI, transporterAPI } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import "./TransportAssign.css";

const TransportAssign = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [transporters, setTransporters] = useState([]);

  const [form, setForm] = useState({
    transporterId: "",
    vehicleNo: "",
    driverName: "",
    driverContact: "",
  });

  // ---------------------------------------------
  // Load Order Details
  // ---------------------------------------------
  useEffect(() => {
    if (orderId) loadOrder(orderId);
    loadTransporters();
  }, [orderId]);

  const loadOrder = async (id) => {
    try {
      const res = await orderAPI.getOrderDetails(id);
      setOrder(res.data);
    } catch (err) {
      console.error("Error loading order details:", err);
    }
  };

  // ---------------------------------------------
  // Load Transporters List
  // ---------------------------------------------
  const loadTransporters = async () => {
    try {
      const res = await transporterAPI.getAll();
      setTransporters(res.data || []);
    } catch (err) {
      console.error("Error loading transporters:", err);
    }
  };

  // ---------------------------------------------
  // Handle Form Changes
  // ---------------------------------------------
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // ---------------------------------------------
  // Assign Transport
  // ---------------------------------------------
  const handleAssign = async (e) => {
    e.preventDefault();

    if (
      !form.transporterId ||
      !form.vehicleNo ||
      !form.driverName ||
      !form.driverContact
    ) {
      alert("❌ All fields are required.");
      return;
    }

    try {
      await transportAPI.assignTransport(orderId, {
        transporterId: Number(form.transporterId),
        vehicleNo: form.vehicleNo,
        driverName: form.driverName,
        driverContact: form.driverContact,
      });

      alert("🚚 Transport assigned successfully!");
      navigate("/farmer/orders");
    } catch (err) {
      console.error("Failed to assign transport:", err);
      alert("❌ Failed to assign transport");
    }
  };

  if (!order)
    return <div className="loading-text">Loading order...</div>;

  return (
    <div className="assign-transport-container">
      <h2>🚚 Assign Transport for Order #{order.id}</h2>

      <div className="order-summary-box">
        <p>
          <b>Total Amount:</b> ₹{order.totalAmount}
        </p>
        <p>
          <b>Ordered On:</b> {new Date(order.createdAt).toLocaleString()}
        </p>
      </div>

      <form className="assign-form" onSubmit={handleAssign}>
        <label>Choose Transporter</label>
        <select
          name="transporterId"
          value={form.transporterId}
          onChange={handleChange}
          required
        >
          <option value="">-- SELECT TRANSPORTER --</option>
          {transporters.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} ({t.phone || "No Phone"})
            </option>
          ))}
        </select>

        <label>Vehicle Number</label>
        <input
          type="text"
          name="vehicleNo"
          placeholder="KA-09-1234"
          value={form.vehicleNo}
          onChange={handleChange}
          required
        />

        <label>Driver Name</label>
        <input
          type="text"
          name="driverName"
          placeholder="Driver Name"
          value={form.driverName}
          onChange={handleChange}
          required
        />

        <label>Driver Contact</label>
        <input
          type="text"
          name="driverContact"
          placeholder="Driver Contact"
          value={form.driverContact}
          onChange={handleChange}
          required
        />

        <button type="submit" className="assign-btn">
          ✔ Assign Transport
        </button>

        <button
          type="button"
          className="cancel-btn"
          onClick={() => navigate("/farmer/orders")}
        >
          ✖ Cancel
        </button>
      </form>
    </div>
  );
};

export default TransportAssign;
