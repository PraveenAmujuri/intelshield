import throttle from "lodash.throttle";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from "./socket/socket";
import { CartProvider } from "./contexts/CartContext";
import NavBar from "./components/NavBar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import CartPage from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Blocked from "./pages/Blocked";
import Admin from "./pages/Admin";

function SecurityTelemetry({ blocked }) {
  const location = useLocation();
  useEffect(() => {
    if (!socket.connected || blocked) return;
    socket.emit("phishing_signal", {
      url: window.location.href,
      hostname: window.location.hostname,
      path_length: window.location.pathname.length + window.location.search.length,
      has_at: window.location.href.includes("@"),
      is_https: window.location.protocol === "https:",
      referrer: document.referrer || "",
      load_time: Math.round(performance.now()),
      user_agent: navigator.userAgent,
    });
  }, [location.pathname, location.search, blocked]);
  return null;
}

function AppContent() {
  const [blocked, setBlocked] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const handleMouseMove = throttle((e) => {
      if (socket.connected && !blocked) {
        socket.emit("mouse_move", {
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
      }
    }, 50);

    window.addEventListener("mousemove", handleMouseMove);
    socket.on("security_lock", (data) => {
      setBlocked(true);
      setReason(data.reason);
    });

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      socket.off("security_lock");
    };
  }, [blocked]);

  if (blocked) return <Blocked reason={reason} />;

  return (
    <>
      <NavBar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="*" element={<Login />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <CartProvider>
      <Router>  {/* ✅ NO basename */}
        <SecurityTelemetry blocked={false} />
        <AppContent />
      </Router>
    </CartProvider>
  );
}

export default App;
