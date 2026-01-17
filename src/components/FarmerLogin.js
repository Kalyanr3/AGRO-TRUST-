import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authAPI } from "../services/api";

const FarmerLogin = ({ login }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await authAPI.farmerLogin({ email, password });

      // ✔ Backend returns: { success, message, farmer:{id,name,email} }
      const farmerData = response.data.farmer;

      // ----------------------------------------------------
      // ✔✔ Store EXACT keys App.js expects
      // ----------------------------------------------------
      localStorage.setItem("user", JSON.stringify(farmerData));
      localStorage.setItem("userType", "farmer");
      localStorage.setItem("isAuthenticated", "true");

      if (login) login(farmerData, "farmer");

      navigate("/farmer/dashboard", { replace: true });

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
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
          <Link to="/farmer/signup" className="nav-link">FARMER SIGNUP</Link>
        </div>
      </nav>

      <div className="form-container">
        <h2>FARMER LOGIN</h2>
        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Don’t have an account? <Link to="/farmer/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default FarmerLogin;
