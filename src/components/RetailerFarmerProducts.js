import React, { useEffect, useState } from "react";
import { retailerAPI, cartAPI } from "../services/api";
import { useParams, useNavigate } from "react-router-dom";
import "./RetailerFarmersProducts.css";

const RetailerFarmerProducts = () => {
  const { farmerId } = useParams();
  const navigate = useNavigate();

  const retailer = JSON.parse(localStorage.getItem("retailer"));
  const retailerId = retailer?.id;

  const [farmer, setFarmer] = useState(null);
  const [products, setProducts] = useState([]);
  const [quantities, setQuantities] = useState({}); // <-- NEW

  // Load farmer + products
  useEffect(() => {
    if (!retailerId) {
      alert("Please log in as retailer");
      navigate("/retailer/login");
      return;
    }

    loadFarmer(farmerId);
  }, [farmerId, navigate, retailerId]);

  const loadFarmer = async (id) => {
    try {
      const res = await retailerAPI.getFarmerById(id);
      setFarmer(res.data);
      setProducts(res.data.products || []);
    } catch (error) {
      console.error("Error loading farmer products:", error);
    }
  };

  // Add product to cart WITH QUANTITY
  const addToCart = async (productId) => {
    const quantity = quantities[productId] || 1;

    try {
      await cartAPI.addToCart(retailerId, productId, quantity);
      alert(`✔ ${quantity} item(s) added to cart!`);
      navigate("/retailer/cart");
    } catch (err) {
      console.error("Failed to add to cart:", err);
      alert("❌ Failed to add product");
    }
  };

  return (
    <div className="farmer-products-page">
      <div className="header-bar">
        <button className="back-btn" onClick={() => navigate("/retailer/dashboard")}>
          ← Back
        </button>

        <h2>🧑‍🌾 FARMER PRODUCTS</h2>

        <button className="cart-btn" onClick={() => navigate("/retailer/cart")}>
          🛒 CART
        </button>
      </div>

      {!farmer ? (
        <p className="loading">Loading farmer...</p>
      ) : (
        <>
          <div className="farmer-info">
            <h3>{farmer.name}</h3>
            <p><b>📞 Phone:</b> {farmer.phone}</p>
            <p><b>📍 Address:</b> {farmer.address}</p>
            <p><b>🧺 Total Products:</b> {products.length}</p>
          </div>

          {products.length === 0 ? (
            <p>No products available for this farmer.</p>
          ) : (
            <table className="product-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Category</th>
                  <th>Price (₹)</th>
                  <th>Qty</th>
                  <th>Add</th>
                </tr>
              </thead>

              <tbody>
                {products.map((p) => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>₹{Number(p.price || 0).toFixed(2)}</td>

                    {/* Quantity Input */}
                    <td>
                      <input
                        type="number"
                        min="1"
                        className="qty-input"
                        value={quantities[p.id] || 1}
                        onChange={(e) =>
                          setQuantities({
                            ...quantities,
                            [p.id]: Number(e.target.value),
                          })
                        }
                      />
                    </td>

                    <td>
                      <button
                        className="add-btn"
                        onClick={() => addToCart(p.id)}
                      >
                        ➕ Add
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default RetailerFarmerProducts;
