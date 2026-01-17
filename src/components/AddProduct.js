import React, { useState, useEffect } from "react";
import { productAPI, retailerAPI } from "../services/api";
import "./AddProduct.css";

const AddProduct = ({ onProductAdded }) => {
  const [retailers, setRetailers] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    batchNumber: "",
    productionDate: "",
    description: "",
    retailerId: "",   // ⭐ required for showing products to user
  });

  const [image, setImage] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Load retailer list
  useEffect(() => {
    const loadRetailers = async () => {
      try {
        const res = await retailerAPI.getAllRetailers();
        setRetailers(res.data);
      } catch (err) {
        console.error("Failed to load retailers", err);
      }
    };
    loadRetailers();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageChange = (e) => setImage(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const farmer = JSON.parse(localStorage.getItem("user"));
      if (!farmer) {
        alert("⚠ Please log in before adding products!");
        setLoading(false);
        return;
      }

      if (!formData.retailerId) {
        alert("⚠ Please select a retailer!");
        setLoading(false);
        return;
      }

      const productData = {
        ...formData,
        price: formData.price ? parseFloat(formData.price) : null,
        productionDate: formData.productionDate || null,
        farmerEmail: farmer.email,
      };

      const submitData = new FormData();
      submitData.append(
        "product",
        new Blob([JSON.stringify(productData)], { type: "application/json" })
      );
      if (image) submitData.append("image", image);

      // ⭐ No unused variable → no ESLint warning
      await productAPI.addProduct(submitData);

      setMessage("✅ Product added successfully!");

      // Reset form
      setFormData({
        name: "",
        category: "",
        price: "",
        batchNumber: "",
        productionDate: "",
        description: "",
        retailerId: "",
      });
      setImage(null);
      const imgInput = document.getElementById("imageInput");
      if (imgInput) imgInput.value = "";

      if (onProductAdded) onProductAdded();
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data?.error ||
        "Network or server error. Try again!";
      setMessage("❌ " + errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <h2>➕ ADD NEW PRODUCT</h2>

      {message && (
        <div
          className={`alert ${
            message.includes("❌") ? "alert-error" : "alert-success"
          }`}
        >
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Retailer Selection */}
        <div className="form-group">
          <label>Select Retailer:</label>
          <select
            name="retailerId"
            value={formData.retailerId}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Retailer --</option>
            {retailers.map((r) => (
              <option key={r.id} value={r.id}>
                {r.storeName} ({r.ownerName})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Product Name:</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <input type="text" name="category" value={formData.category} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Price (₹):</label>
          <input type="number" step="0.01" name="price" value={formData.price} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Batch Number:</label>
          <input type="text" name="batchNumber" value={formData.batchNumber} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label>Production Date:</label>
          <input
            type="date"
            name="productionDate"
            value={formData.productionDate}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label>Product Image:</label>
          <input id="imageInput" type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea name="description" value={formData.description} onChange={handleChange} rows="3" />
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;