import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { orderAPI } from "../services/api";
import "./PaymentPage.css";

const PaymentPage = () => {
  const [method, setMethod] = useState("UPI");
  const [loading, setLoading] = useState(false);
  const retailer = JSON.parse(localStorage.getItem("retailer"));
  const navigate = useNavigate();

  const handlePayment = async () => {
  if (!retailer) return alert("Retailer not found!");

  setLoading(true);
  try {
    const res = await orderAPI.placeOrder(retailer.id, method);
    alert(res.data.message || "✅ Order placed successfully!");
    navigate("/retailer/orders"); // 🔥 Redirect to orders page
  } catch (err) {
    console.error("Payment failed:", err);
    alert("❌ Failed to place order. Try again.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="payment-container">
      <h2>💳 Choose Payment Method</h2>

      <div className="payment-options">
        <label>
          <input
            type="radio"
            value="UPI"
            checked={method === "UPI"}
            onChange={(e) => setMethod(e.target.value)}
          />
          UPI (Instant Payment)
        </label>

        <label>
          <input
            type="radio"
            value="CASH"
            checked={method === "CASH"}
            onChange={(e) => setMethod(e.target.value)}
          />
          CASH on Delivery
        </label>
      </div>

      <button className="pay-btn" onClick={handlePayment} disabled={loading}>
        {loading ? "Processing..." : "✅ Confirm & Place Order"}
      </button>
    </div>
  );
};

export default PaymentPage;