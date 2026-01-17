import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { retailerAPI } from '../services/api';

const RetailerSignup = () => {
  const [formData, setFormData] = useState({
    storeName: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    businessLicense: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const { confirmPassword, ...dataToSend } = formData; // remove confirmPassword
      const res = await retailerAPI.signup(dataToSend);
      console.log("✅ Signup success:", res.data);

      setSuccess("Registration successful! Redirecting...");
      setTimeout(() => navigate("/retailer/login"), 2000);
    } catch (err) {
      console.error("❌ Signup error:", err);
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again."
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
          <Link to="/retailer/login" className="nav-link">RETAILER LOGIN</Link>
          <Link to="/signup" className="nav-link">FARMER SIGNUP</Link>
        </div>
      </nav>

      <div className="form-container">
        <h2>RETAILER SIGNUP</h2>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          {['storeName', 'name', 'email', 'password', 'confirmPassword', 'phone', 'businessLicense', 'address'].map((field) => (
            <div className="form-group" key={field}>
              <label>{field.replace(/([A-Z])/g, " $1")}:</label>

              {field === "address" ? (
                <textarea
                  name={field}
                  rows="3"
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              ) : (
                <input
                  type={
                    field === "password" || field === "confirmPassword"
                      ? "password"
                      : field === "email"
                      ? "email"
                      : "text"
                  }
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  required
                />
              )}
            </div>
          ))}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          Already have an account?{" "}
          <Link to="/retailer/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default RetailerSignup;