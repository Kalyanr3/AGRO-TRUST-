import React, { useState, useEffect } from "react";
import axios from "axios";
import { productAPI } from "../services/api";
import "./ProductList.css";

const ProductList = ({ refreshKey }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =============================
  // FETCH PRODUCTS
  // =============================
  const fetchProducts = async () => {
    setLoading(true);
    setError("");

    try {
      const farmer = JSON.parse(localStorage.getItem("user"));
      if (!farmer) {
        alert("Please log in!");
        setLoading(false);
        return;
      }

      const response = await productAPI.getMyProducts(farmer.email);
      setProducts(response.data);

    } catch (err) {
      const msg = err.response?.data?.message || "Failed to load products.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [refreshKey]);

  // =============================
  // BUILD IMAGE URL
  // =============================
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    return `http://localhost:8080/uploads/${imagePath}`;
  };
  // =============================
  // RENDER
  // =============================
  if (loading) return <div>Loading your products...</div>;
  if (error) return <div style={{ color: "red" }}>❌ {error}</div>;

  if (products.length === 0) {
    return (
      <div className="no-products">
        <h3>No products found</h3>
        <p>Add your first product!</p>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <h2>🧺 MY PRODUCTS</h2>

      <div className="products-grid">
        {products.map((product) => {
          const imageUrl = getImageUrl(product.imagePath);
          const qrUrl = product.qrCodeUrl;

          return (
            <div key={product.id} className="product-card">

              {/* Product Image */}
              <div className="product-image-container">
                {imageUrl ? (
                  <img src={imageUrl} alt={product.name} className="product-image" />
                ) : (
                  <div className="image-placeholder">No Photo</div>
                )}
              </div>

              {/* QR Code */}
              <div className="product-qr-container">
                {qrUrl ? (
                  <img src={qrUrl} alt="QR Code" className="qr-image" />
                ) : (
                  <div className="qr-placeholder">No QR</div>
                )}
              </div>

              {/* Product Info */}
              <div className="product-info">
                <h3>{product.name}</h3>
                <p>📦 {product.category}</p>
                <p>💰 ₹{product.price}</p>
                <p>🔢 Batch: {product.batchNumber}</p>

                <p>
                  🗓️{" "}
                  {product.productionDate
                    ? new Date(product.productionDate).toLocaleDateString()
                    : "N/A"}
                </p>

                {product.description && <p>📝 {product.description}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProductList;
