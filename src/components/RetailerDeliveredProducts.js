import React, { useEffect, useState, useCallback } from "react";
import { orderAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./DeliveredProducts.css";

export default function RetailerDeliveredProducts() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const retailer = JSON.parse(localStorage.getItem("retailer"));

  // ----------------------------
  // LOAD DELIVERED PRODUCTS
  // ----------------------------
  const loadDeliveredProducts = useCallback(async () => {
    try {
      if (!retailer?.id) return;

      const response = await orderAPI.getDeliveredOrders(retailer.id);

      // API RETURNS: order.orderItems[]
      const deliveredProducts = response.data.flatMap((order) =>
        order.items.map((item) => ({
          id: item.productId,
          name: item.productName,
          category: item.productCategory,
          price: item.productPrice,
          quantity: item.quantity,
        }))
      );

      setProducts(deliveredProducts);
    } catch (error) {
      console.error("Failed to load delivered products:", error);
    } finally {
      setLoading(false);
    }
  }, [retailer?.id]);

  // ----------------------------
  // ON PAGE LOAD
  // ----------------------------
  useEffect(() => {
    if (!retailer) {
      navigate("/retailer/login");
      return;
    }

    loadDeliveredProducts();
  }, [navigate, retailer, loadDeliveredProducts]);

  if (loading) return <p className="loading">Loading delivered products...</p>;

  return (
    <div className="delivered-container">
      <h1>✔ DELIVERED PRODUCTS</h1>
      <p>These are the products delivered to you.</p>

      {products.length === 0 ? (
        <p className="no-products">No delivered products yet.</p>
      ) : (
        <div className="delivered-grid">
          {products.map((p, index) => (
            <div key={index} className="delivered-card">
              <h3>{p.name}</h3>
              <p><b>Category:</b> {p.category}</p>
              <p><b>Quantity:</b> {p.quantity}</p>
              <p><b>Price:</b> ₹{p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
