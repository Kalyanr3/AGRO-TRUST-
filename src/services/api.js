import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

// Create Axios instance
const api = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ---------------- Interceptors ----------------
api.interceptors.request.use((config) => {
  config.headers.Accept = "application/json";

  // ⭐ FIX: Proper JSON serialization so backend receives correct body
if (
  config.data &&
  !(config.data instanceof FormData) &&
  typeof config.data === "object"
) {
  config.headers["Content-Type"] = "application/json";
  // axios will serialize data automatically
}
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// =============================================================
//                        AUTH APIs
// =============================================================
export const authAPI = {
  farmerSignup: (data) => api.post("/auth/farmer/register", data),
  farmerLogin: (data) => api.post("/auth/farmer/login", data),
  farmerLogout: () => api.post("/auth/farmer/logout"),

  retailerSignup: (data) => api.post("/retailer/auth/signup", data),
  retailerLogin: (data) => api.post("/retailer/auth/login", data),
  retailerLogout: () => api.post("/retailer/auth/logout"),

  transporterSignup: (data) => api.post("/transporters/signup", data),
  transporterLogin: (data) => api.post("/transporters/login", data),
};

// =============================================================
//                        USER APIs
// =============================================================
export const userAPI = {
  signup: (data) => api.post("/user/signup", data),
  login: (data) => api.post("/user/login", data),

  // Buy Product
  buyProduct: (payload) => api.post("/purchase/buy", payload),

  // User Purchase History
  getPurchaseHistory: (userId) => api.get(`/purchase/history/${userId}`),
};

// =============================================================
//                        FARMER APIs
// =============================================================
export const farmerAPI = {
  getAllFarmers: () => api.get("/farmers/all"),
  getById: (id) => api.get(`/farmers/${id}`),
  getFarmersWithProducts: () => api.get("/farmers/with-products"),
  getFarmerOrders: (farmerId) => api.get(`/orders/farmer/${farmerId}/orders`),
};

// =============================================================
//                        RETAILER APIs
// =============================================================
export const retailerAPI = {
  signup: (data) => api.post("/retailer/auth/signup", data),
  login: (data) => api.post("/retailer/auth/login", data),
  logout: () => api.post("/retailer/auth/logout"),

  getAllFarmersWithProducts: () => api.get("/farmers/with-products"),
  getFarmerById: (id) => api.get(`/farmers/${id}`),

  getAllRetailers: () => api.get("/retailers/all"),

  // Retailer Products for User
  getRetailerProducts: (retailerId) =>
    api.get(`/products/retailer/${retailerId}`),
};

// =============================================================
//                      TRANSPORTER APIs
// =============================================================
export const transporterAPI = {
  signup: (data) => api.post("/transporters/signup", data),
  login: (data) => api.post("/transporters/login", data),
  getAll: () => api.get("/transporters"),
};

// =============================================================
//                        PRODUCT APIs
// =============================================================
export const productAPI = {
  addProduct: (formData) =>
    api.post("/products/add", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  getMyProducts: (email) =>
    api.get(`/products/my/${encodeURIComponent(email)}`),

  getProductsByFarmerId: (farmerId) =>
    api.get(`/products/farmer/${farmerId}`),

  getAllProducts: () => api.get("/products"),

  getProductById: (id) => api.get(`/products/${id}`),
};

// =============================================================
//                        CART APIs
// =============================================================
export const cartAPI = {
  addToCart: (retailerId, productId, quantity) =>
    api.post("/cart/add", { retailerId, productId, quantity }),

  getCart: (retailerId) => api.get(`/cart/${retailerId}`),

  updateQuantity: (itemId, payload) =>
    api.put(`/cart/update/${itemId}`, payload),

  removeItem: (itemId) => api.delete(`/cart/remove/${itemId}`),

  clearCart: (retailerId) => api.delete(`/cart/clear/${retailerId}`),
};

// =============================================================
//                        ORDER APIs
// =============================================================
export const orderAPI = {
  placeOrder: (retailerId, paymentMethod = "Online") =>
    api.post(`/orders/place/${retailerId}?paymentMethod=${paymentMethod}`),

  getRetailerOrders: (retailerId) =>
    api.get(`/orders/retailer/${retailerId}`),

  getOrderDetails: (orderId) => api.get(`/orders/${orderId}`),

  getOrdersForTransporter: (transporterId) =>
    api.get(`/orders/transporter/${transporterId}`),

  assignTransport: (orderId, data) =>
    api.post(`/orders/assign-transport/${orderId}`, data),

  updateTransportStatus: (orderId, status) =>
    api.put(`/orders/update-status/${orderId}`, null, {
      params: { status: status },
    }),

  confirmReceipt: (orderId) => api.put(`/orders/confirm/${orderId}`),

  retailerConfirm: (orderId, confirmed) =>
    api.put(`/orders/retailer-confirm/${orderId}`, null, {
      params: { confirmed: confirmed },
    }),

  getDeliveredOrders: (retailerId) =>
    api.get(`/orders/delivered/${retailerId}`),
};

export default api;
