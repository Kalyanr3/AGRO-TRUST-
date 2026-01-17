import React, { useEffect, useState } from "react";
import { orderAPI } from "../services/api";

const OrderList = () => {
  const retailer = JSON.parse(localStorage.getItem("retailer"));
  const retailerId = retailer?.id;

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (retailerId) fetchOrders();
  }, [retailerId]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await orderAPI.getRetailerOrders(retailerId);
      setOrders(res.data);
    } catch (err) {
      console.error("Error loading orders:", err);
      alert("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING": return "bg-yellow-200 text-yellow-900";
      case "ASSIGNED": return "bg-blue-200 text-blue-900";
      case "IN_TRANSIT": return "bg-orange-200 text-orange-900";
      case "DELIVERED": return "bg-green-200 text-green-900";
      default: return "bg-gray-200 text-gray-900";
    }
  };

  if (loading) return <p className="text-center">Loading…</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">MY ORDERS</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600 text-center">No orders found.</p>
      ) : (
        <table className="min-w-full border bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">ID</th>
              <th className="p-2 border">Total</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Receipt</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="p-2 border text-center">{order.id}</td>
                <td className="p-2 border text-center">₹{order.totalAmount}</td>

                <td className="p-2 border text-center">
                  <span className={`px-2 py-1 rounded ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </td>

                <td className="p-2 border text-center">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>

                <td className="p-2 border text-center">
                  {order.retailerConfirmed ? (
                    <span className="text-green-600">✔ Confirmed</span>
                  ) : (
                    <span className="text-gray-500">Pending</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default OrderList;
