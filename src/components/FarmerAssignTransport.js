import React, { useEffect, useState } from "react";
import { orderAPI, transporterAPI } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import "./FarmerAssignTransport.css";

const FarmerAssignTransport = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [transporters, setTransporters] = useState([]);

  const [form, setForm] = useState({
    transporterId: "",
    vehicleType: "",
    vehicleNo: "",
    driverName: "",
    driverContact: "",
  });

  // Load order
  useEffect(() => {
    if (orderId) loadOrder(orderId);
  }, [orderId]);

  const loadOrder = async (id) => {
    try {
      const res = await orderAPI.getOrderDetails(id);
      setOrder(res.data);
    } catch (err) {
      console.error("Error loading order:", err);
    }
  };

  // Load transporters
  useEffect(() => {
    transporterAPI
      .getAll()
      .then((res) => setTransporters(res.data))
      .catch((err) => console.error("Failed to load transporters:", err));
  }, []);

  // Handle form change + Autofill
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Update field normally
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Auto-fill transporter details
    if (name === "transporterId") {
      const t = transporters.find((x) => x.id === Number(value));

      if (t) {
        setForm((prev) => ({
          ...prev,
          transporterId: value,
          vehicleNo: t.vehicleNo || "",
          driverName: t.name || "",
          driverContact: t.phone || ""  // only if you store phone
        }));
      }
    }
  };

  const handleAssignTransport = async (e) => {
    e.preventDefault();

    if (
      !form.transporterId ||
      !form.vehicleType ||
      !form.vehicleNo ||
      !form.driverName
    ) {
      alert("❌ All fields are required!");
      return;
    }

    try {
      await orderAPI.assignTransport(orderId, {
        transporterId: Number(form.transporterId),
        vehicleType: form.vehicleType,
        vehicleNo: form.vehicleNo,
        driverName: form.driverName,
        driverContact: form.driverContact,
      });

      alert("🚚 Transport assigned successfully!");
      navigate("/farmer/manage-orders");
    } catch (err) {
      console.error("Transport assignment failed:", err);
      alert("❌ Failed to assign transport.");
    }
  };

  if (!order) return <div>Loading order...</div>;

  return (
    <div className="assign-transport-page">
      <h1>🚚 Assign Transport for Order #{order.id}</h1>

      <div className="order-info-box">
        <p><b>Total Amount:</b> ₹{order.totalAmount}</p>
        <p><b>Ordered On:</b> {new Date(order.createdAt).toLocaleString()}</p>
      </div>

      <h3>Transport Details</h3>

      <form className="form-container" onSubmit={handleAssignTransport}>
        
        {/* Transporter Dropdown */}
        <label>Select Transporter:</label>
        <select
          name="transporterId"
          value={form.transporterId}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Transporter --</option>
          {transporters.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name} — {t.vehicleNo}
            </option>
          ))}
        </select>

        {/* Vehicle Type */}
        <label>Vehicle Type:</label>
        <select
          name="vehicleType"
          value={form.vehicleType}
          onChange={handleChange}
          required
        >
          <option value="">-- Select Vehicle Type --</option>
          <option value="Bike">Bike</option>
          <option value="Auto">Auto</option>
          <option value="Tempo">Tempo</option>
          <option value="Mini Truck">Mini Truck</option>
          <option value="Truck">Truck</option>
        </select>

        {/* Auto-filled fields */}
        <input
          type="text"
          name="vehicleNo"
          placeholder="Vehicle Number"
          value={form.vehicleNo}
          readOnly
        />

        <input
          type="text"
          name="driverName"
          placeholder="Driver Name"
          value={form.driverName}
          readOnly
        />

        <input
          type="text"
          name="driverContact"
          placeholder="Driver Contact Number"
          value={form.driverContact}
          onChange={handleChange}
        />

        <button type="submit" className="assign-btn">
          ✔ Assign Transport
        </button>

        <button
          type="button"
          className="cancel-btn"
          onClick={() => navigate("/farmer/manage-orders")}
        >
          ✖ Cancel
        </button>
      </form>
    </div>
  );
};

export default FarmerAssignTransport;
