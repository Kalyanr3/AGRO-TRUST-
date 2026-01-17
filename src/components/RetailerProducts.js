import React, { useEffect, useState } from "react";
import { retailerAPI, userAPI } from "../services/api";
import { useParams } from "react-router-dom";


export default function RetailerProducts() {
  const { retailerId } = useParams();
  const [products, setProducts] = useState([]);

  // ============================
  // FETCH RETAILER PRODUCTS
  // ============================
  useEffect(() => {
    retailerAPI.getRetailerProducts(retailerId).then((res) => {
      setProducts(res.data);
    });
  }, [retailerId]);

  // ============================
  // BUY PRODUCT FUNCTION
  // ============================
const handleBuy = async (productId) => {
  try {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      alert("Please login as User to buy products");
      return;
    }

    const user = JSON.parse(savedUser);

    const payload = {
      userId: user.id,
      productId,
      quantity: 1,
    };

    await userAPI.buyProduct(payload);

    alert("✅ Product purchased successfully!");
  } catch (err) {
    console.error("BUY ERROR:", err?.response?.data || err);
    alert("❌ Failed to buy product");
  }
};


  if (products.length === 0) return <h3>No products available</h3>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>RETAILER PRODUCTS</h2>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {products.map((p) => (
          <div
            key={p.id}
            style={{
              width: "250px",
              border: "1px solid #ddd",
              padding: "15px",
              borderRadius: "10px",
            }}
          >
            <img
              src={p.imageUrl}
              alt={p.name}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />

            <h4>{p.name}</h4>
            <p>₹{p.price}</p>

            {/* QR Code */}
            {p.qrCodeUrl && (
              <img
                src={p.qrCodeUrl}
                alt="QR Code"
                style={{
                  width: "100px",
                  height: "100px",
                  display: "block",
                  margin: "10px auto",
                }}
              />
            )}

           

          </div>
        ))}
      </div>
    </div>
  );
}
