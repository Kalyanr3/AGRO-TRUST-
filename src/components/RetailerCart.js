// src/pages/RetailerCart.js

import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { cartAPI, orderAPI } from "../services/api";
import "./RetailerCart.css";

const RetailerCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [retailer, setRetailer] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // -------------------------------------------------
  // FETCH CART
  // -------------------------------------------------
  const fetchCart = useCallback(async (retailerId) => {
    try {
      const res = await cartAPI.getCart(retailerId);
      const data = Array.isArray(res.data) ? res.data : [];

      setCartItems(data);
      calculateTotal(data);
    } catch (err) {
      console.error("❌ Error fetching cart:", err);
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // -------------------------------------------------
  // CALCULATE TOTAL PRICE
  // -------------------------------------------------
  const calculateTotal = (items) => {
    if (!Array.isArray(items)) return setTotal(0);

    const sum = items.reduce(
      (acc, item) =>
        acc + (item.product?.price || 0) * (item.quantity || 1),
      0
    );

    setTotal(sum);
  };

  // -------------------------------------------------
  // LOAD RETAILER + CART ON MOUNT
  // -------------------------------------------------
  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("retailer"));
    if (!stored) {
      alert("Please log in to view your cart");
      navigate("/retailer/login");
      return;
    }

    setRetailer(stored);
    fetchCart(stored.id);
  }, [fetchCart, navigate]);

  // -------------------------------------------------
  // INCREASE QUANTITY
  // -------------------------------------------------
  const handleIncrease = async (productId) => {
    try {
      await cartAPI.addToCart(retailer.id, productId, 1);
      fetchCart(retailer.id);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to increase quantity");
    }
  };

  // -------------------------------------------------
  // DECREASE QUANTITY
  // -------------------------------------------------
  const handleDecrease = async (item) => {
    try {
      if (item.quantity <= 1) {
        await cartAPI.removeItem(item.id);
      } else {
        await cartAPI.updateQuantity(item.id, {
          quantity: item.quantity - 1,
        });
      }
      fetchCart(retailer.id);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to decrease quantity");
    }
  };

  // -------------------------------------------------
  // REMOVE ONE ITEM
  // -------------------------------------------------
  const handleRemove = async (id) => {
    if (!window.confirm("Remove this item?")) return;

    try {
      await cartAPI.removeItem(id);
      const updated = cartItems.filter((i) => i.id !== id);
      setCartItems(updated);
      calculateTotal(updated);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to remove item");
    }
  };

  // -------------------------------------------------
  // CLEAR CART
  // -------------------------------------------------
  const handleClearCart = async () => {
    if (!window.confirm("Clear entire cart?")) return;

    try {
      await cartAPI.clearCart(retailer.id);
      setCartItems([]);
      setTotal(0);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to clear cart");
    }
  };

  // -------------------------------------------------
  // BUY SINGLE ITEM
  // -------------------------------------------------
  const handleBuyNow = async (item) => {
    if (
      !window.confirm(
        `Buy ${item.product?.name} from ${item.product?.farmer?.name}?`
      )
    )
      return;

    try {
      const res = await orderAPI.placeOrder(retailer.id);

      navigate("/payment", {
        state: {
          order: {
            id: res.data.id,
            totalAmount:
              (item.product?.price || 0) * (item.quantity || 1),
          },
        },
      });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to place order");
    }
  };

  // -------------------------------------------------
  // PLACE FULL ORDER
  // -------------------------------------------------
  const handlePlaceOrder = async () => {
    if (!window.confirm("Confirm full order?")) return;

    try {
      const res = await orderAPI.placeOrder(retailer.id);

      navigate("/payment", {
        state: {
          order: {
            id: res.data.id,
            totalAmount: total,
          },
        },
      });

      setCartItems([]);
      setTotal(0);
    } catch (err) {
      console.error(err);
      alert("❌ Failed to place order");
    }
  };

  if (loading) return <p>Loading cart...</p>;

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>🛒 YOUR SHOPPING CART:</h1>
        <p>
          Welcome, <b>{retailer?.storeName || retailer?.name}</b>
        </p>
      </div>

      {cartItems.length === 0 ? (
        <div className="empty-cart">
          <h2>🛍 Your cart is empty</h2>
          <a href="/retailer/dashboard" className="back-btn">
            ← Back to Dashboard
          </a>
        </div>
      ) : (
        <>
          <table className="cart-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Farmer</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td>{item.product?.name}</td>

                  <td>👨‍🌾 {item.product?.farmer?.name}</td>

                  <td>
                    <div className="qty-controls">
                      <button onClick={() => handleDecrease(item)}>
                        ➖
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleIncrease(item.product?.id)
                        }
                      >
                        ➕
                      </button>
                    </div>
                  </td>

                  <td>₹{item.product?.price}</td>

                  <td>
                    ₹
                    {(item.product?.price || 0) *
                      (item.quantity || 1)}
                  </td>

                  <td>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemove(item.id)}
                    >
                      ❌ Remove
                    </button>

                    <button
                      className="buy-btn"
                      onClick={() => handleBuyNow(item)}
                    >
                      💰 Buy Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="cart-summary">
            <h2>Total: ₹{total.toFixed(2)}</h2>

            <button className="place-btn" onClick={handlePlaceOrder}>
              🛒 Place Full Order
            </button>

            <button className="clear-btn" onClick={handleClearCart}>
              🧹 Clear Cart
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default RetailerCart;
