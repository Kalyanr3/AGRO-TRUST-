import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { retailerAPI, cartAPI } from "../services/api";
import "./FarmerProducts.css";

const FarmerProducts = () => {
  const { id } = useParams(); // farmer id from URL
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [farmer, setFarmer] = useState(null);
  const [retailer, setRetailer] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedRetailer = JSON.parse(localStorage.getItem("retailer"));
    if (!storedRetailer) {
      alert("Please log in as a retailer first!");
      navigate("/retailer/login");
      return;
    }
    setRetailer(storedRetailer);

 
    farmerAPI.getById(id)
      .then((res) => {
        setFarmer(res.data);
        setProducts(res.data.products || []);
      })
      .catch((err) => console.error("Error fetching farmer:", err));
  }, [id, navigate]);

  const handleAddToCart = async (productId) => {
    if (!retailer) {
      alert("Retailer info not found. Please login again.");
      return;
    }

    const quantity = quantities[productId] || 1;

    try {
      await cartAPI.addToCart(retailer.id, productId, quantity);
      alert("✅ Product added to cart successfully!");
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("❌ Failed to add to cart.");
    }
  };

  if (!farmer)
    return <p className="loading-text">🌿 Loading farmer products...</p>;

  return (
    <div className="farmer-dashboard">
      {/* 🌾 Top Dashboard Header */}
      <header className="dashboard-top">
        <div className="left">
          <h1>👨‍🌾 {} Fresh Products</h1>
          <p>Explore fresh produce directly from this farmer.</p>
        </div>
        <div className="right">
          <button
            className="dashboard-btn"
            onClick={() => navigate("/retailer/dashboard")}
          >
            ← Back to Dashboard
          </button>
        </div>
      </header>

      {/* 📦 Product Table */}
      <div className="table-container">
        {products.length === 0 ? (
          <p className="no-products">No products found for this farmer.</p>
        ) : (
          <table className="product-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.category}</td>
                  <td>{p.price}</td>
                  <td>{p.description}</td>
                  <td>
                    <input
                      type="number"
                      min="1"
                      value={quantities[p.id] || 1}
                      onChange={(e) =>
                        setQuantities({ ...quantities, [p.id]: e.target.value })
                      }
                      className="qty-input"
                    />
                  </td>
                  <td>
                    <button
                      className="add-btn"
                      onClick={() => handleAddToCart(p.id)}
                    >
                      🛒 Add
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default FarmerProducts;
