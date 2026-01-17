

// import { useState, useEffect } from "react";
// import {
//   BrowserRouter as Router,
//   Routes,
//   Route,
//   Navigate,
// } from "react-router-dom";

// import "./App.css";

// // ---------- Common ----------
// import Home from "./components/Home";

// // ---------- Farmer ----------
// import FarmerLogin from "./components/FarmerLogin";
// import FarmerSignup from "./components/FarmerSignup";
// import FarmerDashboard from "./components/FarmerDashboard";
// import AddProduct from "./components/AddProduct";
// import ProductList from "./components/ProductList";
// import FarmerAssignTransport from "./components/FarmerAssignTransport";
// import FarmerManageOrders from "./components/FarmerManageOrders";

// // ---------- Retailer ----------
// import RetailerLogin from "./components/RetailerLogin";
// import RetailerSignup from "./components/RetailerSignup";
// import RetailerDashboard from "./components/RetailerDashboard";
// import RetailerFarmerProducts from "./components/RetailerFarmerProducts";
// import RetailerCart from "./components/RetailerCart";
// import RetailerOrders from "./components/RetailerOrders";
// import ConfirmReceipt from "./components/ConfirmReceipt";
// import PaymentPage from "./components/PaymentPage";
// import OrderDetails from "./components/OrderDetails";
// import RetailerDeliveredProducts from "./components/RetailerDeliveredProducts";

// // ---------- Transport ----------
// import TransportSignup from "./components/TransportSignup";
// import TransportLogin from "./components/TransportLogin";
// import TransportDashboard from "./components/TransportDashboard";

// // ---------- User ----------
// import UserSignup from "./components/UserSignup";
// import UserLogin from "./components/UserLogin";
// import UserDashboard from "./components/UserDashboard";

// // ---------- USER → RETAILER FLOW ----------
// import UserRetailerList from "./components/UserRetailerList";


// // ⭐ NEW Retailer Product Page
// import RetailerProducts from "./components/RetailerProducts";

// function App() {
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [userType, setUserType] = useState(null);

//   // Load auth from LocalStorage
//   useEffect(() => {
//     const auth = localStorage.getItem("isAuthenticated");
//     const userData = localStorage.getItem("user");
//     const type = localStorage.getItem("userType");

//     if (auth === "true" && userData && type) {
//       setIsAuthenticated(true);
//       setUser(JSON.parse(userData));
//       setUserType(type);
//     }
//   }, []);

//   // Login
//   const login = (userData, type) => {
//     setIsAuthenticated(true);
//     setUser(userData);
//     setUserType(type);

//     localStorage.setItem("isAuthenticated", "true");
//     localStorage.setItem("user", JSON.stringify(userData));
//     localStorage.setItem("userType", type);
//   };

//   // Logout
//   const logout = () => {
//     setIsAuthenticated(false);
//     setUser(null);
//     setUserType(null);
//     localStorage.clear();
//   };

//   // Protected Route Wrapper
//   const ProtectedRoute = ({ children, allowedType }) => {
//     const auth = localStorage.getItem("isAuthenticated");
//     const storedType = localStorage.getItem("userType");

//     if (auth !== "true") {
//       return <Navigate to={`/${allowedType}/login`} replace />;
//     }
//     if (storedType !== allowedType) {
//       return <Navigate to={`/${storedType}/dashboard`} replace />;
//     }
//     return children;
//   };

//   return (
//     <Router>
//       <Routes>
//         {/* HOME */}
//         <Route
//           path="/"
//           element={
//             <Home
//               isAuthenticated={isAuthenticated}
//               user={user}
//               userType={userType}
//               logout={logout}
//             />
//           }
//         />

//         {/* ---------------- FARMER ROUTES ---------------- */}
//         <Route
//           path="/farmer/login"
//           element={
//             !isAuthenticated ? (
//               <FarmerLogin login={(u) => login(u, "farmer")} />
//             ) : (
//               <Navigate to="/farmer/dashboard" replace />
//             )
//           }
//         />

//         <Route path="/farmer/signup" element={<FarmerSignup />} />

//         <Route
//           path="/farmer/dashboard"
//           element={
//             <ProtectedRoute allowedType="farmer">
//               <FarmerDashboard user={user} logout={logout} />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/farmer/products"
//           element={
//             <ProtectedRoute allowedType="farmer">
//               <ProductList />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/farmer/add-product"
//           element={
//             <ProtectedRoute allowedType="farmer">
//               <AddProduct />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/farmer/manage-orders"
//           element={
//             <ProtectedRoute allowedType="farmer">
//               <FarmerManageOrders />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/farmer/assign-transport/:orderId"
//           element={
//             <ProtectedRoute allowedType="farmer">
//               <FarmerAssignTransport />
//             </ProtectedRoute>
//           }
//         />

//         {/* ---------------- RETAILER ROUTES ---------------- */}
//         <Route
//           path="/retailer/login"
//           element={
//             !isAuthenticated ? (
//               <RetailerLogin login={(u) => login(u, "retailer")} />
//             ) : (
//               <Navigate to="/retailer/dashboard" replace />
//             )
//           }
//         />

//         <Route path="/retailer/signup" element={<RetailerSignup />} />

//         <Route
//           path="/retailer/dashboard"
//           element={
//             <ProtectedRoute allowedType="retailer">
//               <RetailerDashboard user={user} logout={logout} />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/retailer/farmer/:farmerId"
//           element={
//             <ProtectedRoute allowedType="retailer">
//               <RetailerFarmerProducts />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/retailer/cart"
//           element={
//             <ProtectedRoute allowedType="retailer">
//               <RetailerCart />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/retailer/orders"
//           element={
//             <ProtectedRoute allowedType="retailer">
//               <RetailerOrders />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/order-details/:id"
//           element={
//             <ProtectedRoute allowedType="retailer">
//               <OrderDetails />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/retailer/delivered-orders"
//           element={
//             <ProtectedRoute allowedType="retailer">
//               <ConfirmReceipt />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/retailer/delivered-products"
//           element={
//             <ProtectedRoute allowedType="retailer">
//               <RetailerDeliveredProducts />
//             </ProtectedRoute>
//           }
//         />

//         <Route
//           path="/payment"
//           element={
//             <ProtectedRoute allowedType="retailer">
//               <PaymentPage />
//             </ProtectedRoute>
//           }
//         />

//         {/* ---------------- USER ROUTES ---------------- */}
//         <Route
//           path="/user/login"
//           element={
//             !isAuthenticated ? (
//               <UserLogin login={(u) => login(u, "user")} />
//             ) : (
//               <Navigate to="/user/dashboard" replace />
//             )
//           }
//         />

//         <Route path="/user/signup" element={<UserSignup />} />

//         <Route
//           path="/user/dashboard"
//           element={
//             <ProtectedRoute allowedType="user">
//               <UserDashboard user={user} logout={logout} />
//             </ProtectedRoute>
//           }
//         />

//         {/* ⭐ USER → RETAILER FLOW */}
//         <Route
//           path="/user/retailers"
//           element={
//             <ProtectedRoute allowedType="user">
//               <UserRetailerList />
//             </ProtectedRoute>
//           }
//         />

//         {/* ⭐ FINAL — ONLY THIS ROUTE (UserRetailerProducts removed) */}
//         <Route
//           path="/user/retailer/:retailerId"
//           element={
//             <ProtectedRoute allowedType="user">
//               <RetailerProducts />
//             </ProtectedRoute>
//           }
//         />

//         {/* ---------------- TRANSPORT ROUTES ---------------- */}
//         <Route path="/transport/signup" element={<TransportSignup />} />

//         <Route
//           path="/transport/login"
//           element={
//             !isAuthenticated ? (
//               <TransportLogin login={(u) => login(u, "transporter")} />
//             ) : (
//               <Navigate to="/transport/dashboard" replace />
//             )
//           }
//         />

//         <Route
//           path="/transport/dashboard"
//           element={
//             <ProtectedRoute allowedType="transporter">
//               <TransportDashboard user={user} logout={logout} />
//             </ProtectedRoute>
//           }
//         />

//         {/* FALLBACK */}
//         <Route path="*" element={<Navigate to="/" replace />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;











import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import "./App.css";

// ---------- Common ----------
import Home from "./components/Home";

// ---------- Farmer ----------
import FarmerLogin from "./components/FarmerLogin";
import FarmerSignup from "./components/FarmerSignup";
import FarmerDashboard from "./components/FarmerDashboard";
import AddProduct from "./components/AddProduct";
import ProductList from "./components/ProductList";
import FarmerAssignTransport from "./components/FarmerAssignTransport";
import FarmerManageOrders from "./components/FarmerManageOrders";

// ---------- Retailer ----------
import RetailerLogin from "./components/RetailerLogin";
import RetailerSignup from "./components/RetailerSignup";
import RetailerDashboard from "./components/RetailerDashboard";
import RetailerFarmerProducts from "./components/RetailerFarmerProducts";
import RetailerCart from "./components/RetailerCart";
import RetailerOrders from "./components/RetailerOrders";
import ConfirmReceipt from "./components/ConfirmReceipt";
import PaymentPage from "./components/PaymentPage";
import OrderDetails from "./components/OrderDetails";
import RetailerDeliveredProducts from "./components/RetailerDeliveredProducts";

// ---------- Transport ----------
import TransportSignup from "./components/TransportSignup";
import TransportLogin from "./components/TransportLogin";
import TransportDashboard from "./components/TransportDashboard";

// ---------- User ----------
import UserSignup from "./components/UserSignup";
import UserLogin from "./components/UserLogin";
import UserDashboard from "./components/UserDashboard";

// ---------- USER → RETAILER FLOW ----------
import UserRetailerList from "./components/UserRetailerList";

// ⭐ NEW Retailer Product Page
import RetailerProducts from "./components/RetailerProducts";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState(null);

  // Load auth from LocalStorage
  useEffect(() => {
    const auth = localStorage.getItem("isAuthenticated");
    const userData = localStorage.getItem("user");
    const type = localStorage.getItem("userType");

    if (auth === "true" && userData && type) {
      try {
        const parsedUser = JSON.parse(userData);
        setIsAuthenticated(true);
        setUser(parsedUser);
        setUserType(type);
      } catch (e) {
        console.error("Invalid JSON in localStorage for 'user':", e);
        localStorage.removeItem("user"); // Remove corrupted value
      }
    }
  }, []);

  // Login
  const login = (userData, type) => {
    setIsAuthenticated(true);
    setUser(userData);
    setUserType(type);

    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("userType", type);
  };

  // Logout
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setUserType(null);
    localStorage.clear();
  };

  // Protected Route Wrapper
  const ProtectedRoute = ({ children, allowedType }) => {
    const auth = localStorage.getItem("isAuthenticated");
    const storedType = localStorage.getItem("userType");

    if (auth !== "true") {
      return <Navigate to={`/${allowedType}/login`} replace />;
    }
    if (storedType !== allowedType) {
      return <Navigate to={`/${storedType}/dashboard`} replace />;
    }
    return children;
  };

  return (
    <Router>
      <Routes>
        {/* HOME */}
        <Route
          path="/"
          element={
            <Home
              isAuthenticated={isAuthenticated}
              user={user}
              userType={userType}
              logout={logout}
            />
          }
        />

        {/* ---------------- FARMER ROUTES ---------------- */}
        <Route
          path="/farmer/login"
          element={
            !isAuthenticated ? (
              <FarmerLogin login={(u) => login(u, "farmer")} />
            ) : (
              <Navigate to="/farmer/dashboard" replace />
            )
          }
        />

        <Route path="/farmer/signup" element={<FarmerSignup />} />

        <Route
          path="/farmer/dashboard"
          element={
            <ProtectedRoute allowedType="farmer">
              <FarmerDashboard user={user} logout={logout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farmer/products"
          element={
            <ProtectedRoute allowedType="farmer">
              <ProductList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farmer/add-product"
          element={
            <ProtectedRoute allowedType="farmer">
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farmer/manage-orders"
          element={
            <ProtectedRoute allowedType="farmer">
              <FarmerManageOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/farmer/assign-transport/:orderId"
          element={
            <ProtectedRoute allowedType="farmer">
              <FarmerAssignTransport />
            </ProtectedRoute>
          }
        />

        {/* ---------------- RETAILER ROUTES ---------------- */}
        <Route
          path="/retailer/login"
          element={
            !isAuthenticated ? (
              <RetailerLogin login={(u) => login(u, "retailer")} />
            ) : (
              <Navigate to="/retailer/dashboard" replace />
            )
          }
        />

        <Route path="/retailer/signup" element={<RetailerSignup />} />

        <Route
          path="/retailer/dashboard"
          element={
            <ProtectedRoute allowedType="retailer">
              <RetailerDashboard user={user} logout={logout} />
            </ProtectedRoute>
          }
        />

        <Route
          path="/retailer/farmer/:farmerId"
          element={
            <ProtectedRoute allowedType="retailer">
              <RetailerFarmerProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/retailer/cart"
          element={
            <ProtectedRoute allowedType="retailer">
              <RetailerCart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/retailer/orders"
          element={
            <ProtectedRoute allowedType="retailer">
              <RetailerOrders />
            </ProtectedRoute>
          }
        />

        <Route
          path="/order-details/:id"
          element={
            <ProtectedRoute allowedType="retailer">
              <OrderDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/retailer/delivered-orders"
          element={
            <ProtectedRoute allowedType="retailer">
              <ConfirmReceipt />
            </ProtectedRoute>
          }
        />

        <Route
          path="/retailer/delivered-products"
          element={
            <ProtectedRoute allowedType="retailer">
              <RetailerDeliveredProducts />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedType="retailer">
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        {/* ---------------- USER ROUTES ---------------- */}
        <Route
          path="/user/login"
          element={
            !isAuthenticated ? (
              <UserLogin login={(u) => login(u, "user")} />
            ) : (
              <Navigate to="/user/dashboard" replace />
            )
          }
        />

        <Route path="/user/signup" element={<UserSignup />} />

        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute allowedType="user">
              <UserDashboard user={user} logout={logout} />
            </ProtectedRoute>
          }
        />

        {/* ⭐ USER → RETAILER FLOW */}
        <Route
          path="/user/retailers"
          element={
            <ProtectedRoute allowedType="user">
              <UserRetailerList />
            </ProtectedRoute>
          }
        />

        {/* ⭐ FINAL — NEW RETAILER PRODUCTS PAGE */}
        <Route
          path="/user/retailer/:retailerId"
          element={
            <ProtectedRoute allowedType="user">
              <RetailerProducts />
            </ProtectedRoute>
          }
        />

        {/* ---------------- TRANSPORT ROUTES ---------------- */}
        <Route path="/transport/signup" element={<TransportSignup />} />

        <Route
          path="/transport/login"
          element={
            !isAuthenticated ? (
              <TransportLogin login={(u) => login(u, "transporter")} />
            ) : (
              <Navigate to="/transport/dashboard" replace />
            )
          }
        />

        <Route
          path="/transport/dashboard"
          element={
            <ProtectedRoute allowedType="transporter">
              <TransportDashboard user={user} logout={logout} />
            </ProtectedRoute>
          }
        />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
