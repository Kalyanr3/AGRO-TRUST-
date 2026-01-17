import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { transporterAPI } from "../services/api";


const TransportLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await transporterAPI.login(form);

      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userType", "transporter");
      localStorage.setItem("transporter", JSON.stringify(res.data));
      localStorage.setItem("user", JSON.stringify(res.data));

      alert("🚚 Welcome " + res.data.name);
      navigate("/transport/dashboard");
    } catch (err) {
      alert("❌ Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* ⭐ NAVBAR ADDED */}
      <nav className="navbar">
        <div className="nav-brand">AGRO-TRUST!!</div>

        <div className="nav-links">
          <Link to="/" className="nav-link">HOME</Link>
          <Link to="/transport/login" className="nav-link">TRANSPORT LOGIN</Link>
          <Link to="/transport/signup" className="nav-link">TRANSPORT SIGNUP</Link>
        </div>
      </nav>

      <div className="auth-container">
        <h1>🚚 TRANSPORTER LOGIN</h1>

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            onChange={handleChange}
            required
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "⏳ Logging in..." : "Login"}
          </button>
        </form>

        <p>
          New here? <Link to="/transport/signup">Signup</Link>
        </p>
      </div>
    </div>
  );
};

export default TransportLogin;
