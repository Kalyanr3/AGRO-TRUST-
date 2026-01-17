import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { transporterAPI } from '../services/api';
import "./TransportSignup.css";

const TransportSignup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    vehicleNo: "",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = form; // remove confirmPassword
      await transporterAPI.signup(dataToSend);

      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/transport/login"), 2000);
    } catch (err) {
      console.error("Signup error:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Try again."
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
          <Link to="/transport/login" className="nav-link">TRANSPORT LOGIN</Link>
          <Link to="/transport/signup" className="nav-link">TRANSPORT SIGNUP</Link>
        </div>
      </nav>

      <div className="form-container">
        <h2>TRANSPORTER SIGNUP</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {["name", "email", "password", "confirmPassword", "phone", "vehicleNo"].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.replace(/([A-Z])/g, " $1")}:</label>

              <input
                type={
                  field === "password" || field === "confirmPassword"
                    ? "password"
                    : field === "email"
                    ? "email"
                    : "text"
                }
                name={field}
                value={form[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already registered?{" "}
          <Link to="/transport/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default TransportSignup;