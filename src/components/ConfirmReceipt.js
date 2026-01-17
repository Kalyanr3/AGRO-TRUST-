import React, { useEffect, useState } from "react";
import { orderAPI, transporterAPI } from "../services/api";

const ConfirmReceipt = () => {
  const retailer = JSON.parse(localStorage.getItem("retailer"));
  const retailerId = retailer?.id;

  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (retailerId) fetchDeliveredOrders();
  }, [retailerId]);

  const fetchDeliveredOrders = async () => {
    try {
      setLoading(true);

      const res = await orderAPI.getRetailerDeliveredOrders(retailerId);

      const ordersWithTransport = await Promise.all(
        res.data.map(async (order) => {
          try {
            const t = await transporterAPI.getTransportByOrderId(order.id);
            return { ...order, transport: t.data };
          } catch {
            return { ...order, transport: null };
          }
        })
      );

      setDeliveredOrders(ordersWithTransport);
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to load delivered orders");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (orderId) => {
    if (!window.confirm("Confirm product receipt?")) return;

    try {
      await orderAPI.confirmReceipt(orderId);
      alert("Receipt confirmed!");
      fetchDeliveredOrders();
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to confirm receipt");
    }
  };

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Confirm Delivered Orders</h2>

      {deliveredOrders.length === 0 ? (
        <p className="text-gray-600 text-center">No delivered orders found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {deliveredOrders.map((order) => (
            <div key={order.id} className="border p-4 rounded bg-white shadow">
              <h3 className="font-bold">Order #{order.id}</h3>
              <p><strong>Total:</strong> ₹{order.totalAmount}</p>
              <p><strong>Payment:</strong> {order.paymentMethod}</p>
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>

              {order.transport && (
                <div className="bg-gray-100 mt-3 p-2 rounded">
                  <strong>Transport:</strong>
                  <p>Driver: {order.transport.driverName}</p>
                  <p>Contact: {order.transport.contact}</p>
                  <p>Vehicle: {order.transport.vehicleNo}</p>
                </div>
              )}

              <div className="mt-3">
                {order.retailerConfirmed ? (
                  <span className="text-green-600 font-bold">✔ Confirmed</span>
                ) : (
                  <button
                    onClick={() => handleConfirm(order.id)}
                    className="w-full bg-green-600 text-white py-2 rounded"
                  >
                    Confirm Receipt
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfirmReceipt;
