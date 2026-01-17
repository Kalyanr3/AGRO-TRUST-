import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserLogin = ({ login }) => {
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
      const res = await axios.post("http://localhost:8080/api/user/login", {
        email,
        password,
      });

      // backend returns { success, message, user:{id,name,email} }
      const userData = res.data.user;

      // STORE SAME AS FARMER LOGIN
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("userType", "user");
      localStorage.setItem("isAuthenticated", "true");

      if (login) login(userData, "user");

      navigate("/user/dashboard", { replace: true });

    } catch (err) {
      setError(err.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">AGRO-TRUST!!</div>
        <div className="nav-links">
          <Link to="/" className="nav-link">LOGIN</Link>
          <Link to="/user/signup" className="nav-link">USER SIGNUP</Link>
        </div>
      </nav>

      {/* LOGIN FORM */}
      <div className="form-container">
        <h2>USER LOGIN</h2>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Don’t have an account? <Link to="/user/signup">Sign up here</Link>
        </p>
      </div>
    </div>
  );
};

export default UserLogin;
