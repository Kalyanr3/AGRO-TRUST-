// src/components/FarmerList.js
import React, { useEffect, useState } from 'react';
import { farmerAPI } from '../services/api'; // Adjust path if needed
import './FarmerList.css';

const FarmerList = () => {
  const [farmers, setFarmers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFarmers = async () => {
      try {
        const response = await farmerAPI.getAllFarmers(); // adjust according to your backend API
        setFarmers(response.data);
      } catch (err) {
        setError('Failed to fetch farmers.');
      } finally {
        setLoading(false);
      }
    };
    fetchFarmers();
  }, []);

  if (loading) return <p>Loading farmers...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="farmer-list">
      <h2>Registered Farmers</h2>
      {farmers.length === 0 ? (
        <p>No farmers registered yet.</p>
      ) : (
        <table className="farmer-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {farmers.map((farmer) => (
              <tr key={farmer.id}>
                <td>{farmer.name}</td>
                <td>{farmer.email}</td>
                <td>{farmer.phone}</td>
                <td>{farmer.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default FarmerList;
