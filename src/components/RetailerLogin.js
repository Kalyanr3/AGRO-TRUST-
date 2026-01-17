// RetailerLogin.js
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { retailerAPI } from "../services/api";

const RetailerLogin = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await retailerAPI.login(formData);

      const retailerData = {
        id: response.data.retailerId,
        storeName: response.data.storeName,
        name: response.data.ownerName,
        email: response.data.email,
      };

      // ✅ Store only retailer object
      localStorage.setItem("retailer", JSON.stringify(retailerData));

      // ✅ Authentication flags
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userType", "retailer");

      alert("Login successful!");
      navigate("/retailer/dashboard", { replace: true });

    } catch (error) {
      console.error("Login error:", error);
      setError(
        error.response?.data?.error ||
          error.response?.data?.message ||
          "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <nav className="navbar">
        <div className="nav-brand">AGRO-TRUST!!</div>
        <div className="nav-links">
          <Link to="/" className="nav-link">HOME</Link>
          <Link to="/retailer/signup" className="nav-link">RETAILER SIGNUP</Link>
          <Link to="/login" className="nav-link">FARMER LOGIN</Link>
        </div>
      </nav>

      <div className="form-container">
        <h2>RETAILER LOGIN</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Don't have an account?{" "}
          <Link to="/retailer/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default RetailerLogin;
