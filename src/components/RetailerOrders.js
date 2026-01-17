// import React, { useEffect, useState } from "react";
// import { orderAPI } from "../services/api";
// import { useNavigate } from "react-router-dom";
// import "./RetailerOrders.css";

// const RetailerOrders = () => {
//   const navigate = useNavigate();

//   const [orders, setOrders] = useState([]);
//   const [retailer, setRetailer] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const stored = JSON.parse(localStorage.getItem("retailer"));
//     if (!stored) {
//       navigate("/retailer/login");
//       return;
//     }
//     setRetailer(stored);
//     loadOrders(stored.id);
//   }, [navigate]);

//   const loadOrders = async (retailerId) => {
//     try {
//       const res = await orderAPI.getRetailerOrders(retailerId);
//       setOrders(res.data || []);
//     } catch (err) {
//       console.error("Error loading orders:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const formatDate = (dateString) => {
//     if (!dateString) return "—";
//     const d = new Date(dateString);
//     if (isNaN(d)) return "—";
//     return d.toLocaleString("en-IN", {
//       dateStyle: "medium",
//       timeStyle: "short",
//     });
//   };

//   return (
//     <div className="orders-page">
//       {/* HEADER */}
//       <div className="orders-header">
//         <button className="back-btn" onClick={() => navigate("/retailer/dashboard")}>
//           ← Back to Dashboard
//         </button>

//         <h1 className="page-title">📦 MY ORDERS</h1>

//         <p className="welcome-text">
//           Welcome back, <b>{retailer?.storeName || retailer?.name}</b>
//         </p>
//       </div>

//       {/* TABLE */}
//       <div className="orders-container">
//         {loading ? (
//           <div className="loading">Loading orders...</div>
//         ) : (
//           <table className="orders-table">
//             <thead>
//               <tr>
//                 <th>Order ID</th>
//                 <th>Date</th>
//                 <th>Total</th>
//                 <th>Payment Method</th>
//                 <th>Payment Status</th>
//                 <th>View</th>
//               </tr>
//             </thead>

//             <tbody>
//               {orders.length === 0 ? (
//                 <tr>
//                   <td colSpan="6" className="no-orders">
//                     No orders found 🛒
//                   </td>
//                 </tr>
//               ) : (
//                 orders.map((o) => (
//                   <tr key={o.orderId ?? o.id}>
//                     <td>{o.orderId ?? o.id}</td>
//                     <td>{formatDate(o.createdAt)}</td>
//                     <td>₹{o.totalAmount?.toFixed(2)}</td>
//                     <td>{o.paymentMethod}</td>
//                     <td>
//                       <span className={o.paymentStatus === "PAID" ? "paid" : "pending"}>
//                         {o.paymentStatus}
//                       </span>
//                     </td>
//                     <td>
//                       <button
//                         className="view-btn"
//                         onClick={() =>
//                           navigate(`/order-details/${o.orderId ?? o.id}`, {
//                             state: { order: o },
//                           })
//                         }
//                       >
//                         🔍 VIEW
//                       </button>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// };

// export default RetailerOrders;


import React, { useEffect, useState } from "react";
import { orderAPI } from "../services/api";
import { useNavigate } from "react-router-dom";
import "./RetailerOrders.css";

const RetailerOrders = () => {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [retailer, setRetailer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("retailer"));
    if (!stored) {
      navigate("/retailer/login");
      return;
    }
    setRetailer(stored);
    loadOrders(stored.id);
  }, [navigate]);

  const loadOrders = async (retailerId) => {
    try {
      const res = await orderAPI.getRetailerOrders(retailerId);

      // 🔥 FIX: Filter out orders that have no items
      const validOrders = (res.data || []).filter(
        (o) => o.items && Array.isArray(o.items) && o.items.length > 0
      );

      setOrders(validOrders);
    } catch (err) {
      console.error("Error loading orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "—";
    const d = new Date(dateString);
    if (isNaN(d)) return "—";
    return d.toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="orders-page">
      {/* HEADER */}
      <div className="orders-header">
        <button className="back-btn" onClick={() => navigate("/retailer/dashboard")}>
          ← Back to Dashboard
        </button>

        <h1 className="page-title">📦 MY ORDERS</h1>

        <p className="welcome-text">
          Welcome back, <b>{retailer?.storeName || retailer?.name}</b>
        </p>
      </div>

      {/* TABLE */}
      <div className="orders-container">
        {loading ? (
          <div className="loading">Loading orders...</div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date</th>
                <th>Total</th>
                <th>Payment Method</th>
                <th>Payment Status</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>
              {orders.length === 0 ? (
                <tr>
                  <td colSpan="6" className="no-orders">
                    No orders found 🛒
                  </td>
                </tr>
              ) : (
                orders.map((o) => (
                  <tr key={o.orderId ?? o.id}>
                    <td>{o.orderId ?? o.id}</td>
                    <td>{formatDate(o.createdAt)}</td>
                    <td>₹{o.totalAmount?.toFixed(2)}</td>
                    <td>{o.paymentMethod}</td>
                    <td>
                      <span className={o.paymentStatus === "PAID" ? "paid" : "pending"}>
                        {o.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() =>
                          navigate(`/order-details/${o.orderId ?? o.id}`, {
                            state: { order: o },
                          })
                        }
                      >
                        🔍 VIEW
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RetailerOrders;
