import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    if (!role) {
      alert('Please select a role');
      return;
    }

    // Temporary mock login (replace with API calls later)
    const userData = {
      email,
      role,
      name:
        role === 'Farmer'
          ? 'Farmer User'
          : role === 'Retailer'
          ? 'Retailer User'
          : role === 'Transport'
          ? 'Transport User'
          : 'Normal User',
    };

    // Save to localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userType', role.toLowerCase());

    // Redirect based on role
    if (role === 'Farmer') navigate('/farmer/dashboard');
    else if (role === 'Retailer') navigate('/retailer/dashboard');
    else if (role === 'Transport') navigate('/transport/dashboard');
    else if (role === 'User') navigate('/user/dashboard');  // ✅ Added for USER
  };

  return (
    <div className="home-container">
      <div className="login-card">
        <h2>WELCOME TO AGRO-TRUST : AGRICULTURE PRODUCT SUPPLY CHAIN MANAGEMENT USING BLOCKCHAIN AND IOT</h2>
        <h3>Sign In</h3>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="">-- SELECT ROLE --</option>
              <option value="Farmer">FARMER</option>
              <option value="Retailer">RETAILER</option>
              <option value="Transport">TRANSPORT</option>
              <option value="User">USER</option> {/* ✅ Added User */}
            </select>
          </div>

          <button type="submit" className="login-btn">Sign In</button>
        </form>

        <div className="signup-buttons">
          <button onClick={() => navigate('/farmer/signup')}>Signup as Farmer</button>
          <button onClick={() => navigate('/retailer/signup')}>Signup as Retailer</button>
          <button onClick={() => navigate('/transport/signup')}>Signup as Transport</button>
          <button onClick={() => navigate('/user/signup')}>Signup as User</button> {/* ✅ Added User Signup */}
        </div>
      </div>
    </div>
  );
};

export default Home;
