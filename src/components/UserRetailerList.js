import React, { useEffect, useState } from "react";
import { retailerAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./UserRetailerList.css";

export default function UserRetailerList() {
  const [retailers, setRetailers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadRetailers();
  }, []);

  const loadRetailers = async () => {
    try {
      const res = await retailerAPI.getAllRetailers();
      setRetailers(res.data);
    } catch (err) {
      console.error("Retailer load failed", err);
    }
  };

  return (
    <div className="retailer-container">
      <h2>AVAILABLE RETAILERS</h2>

      <div className="retailer-grid">
        {retailers.map((r) => (
          <div
            key={r.id}
            className="retailer-card"
            onClick={() => navigate(`/user/retailer/${r.id}`)}
          >
            <h3>{r.storeName}</h3>
            <p>Owner: {r.ownerName}</p>
            <p>📞 {r.phone}</p>
            <p>{r.address}</p>
          </div>
        ))}
      </div>
    </div>
  );
} 