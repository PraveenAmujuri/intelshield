import throttle from "lodash.throttle";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { socket } from "./socket/socket";
import Login from "./pages/Login";
import Shop from "./pages/Shop";
import Blocked from "./pages/Blocked";
import Register from "./pages/Register";
import Checkout from "./pages/Checkout";  

function SecurityTelemetry({ blocked }) {
  const location = useLocation();
  
  useEffect(() => {
    if (!socket.connected || blocked) return;
    
    const url = window.location;
    socket.emit("phishing_signal", {
      url: url.href,
      hostname: url.hostname,
      path_length: url.pathname.length + url.search.length,
      has_at: url.href.includes("@"),
      is_https: url.protocol === "https:",
      referrer: document.referrer || "",
      load_time: Math.round(performance.now()),
      user_agent: navigator.userAgent,
    });
  }, [location.pathname, location.search, blocked]);

  return null;
}

function App() {
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

  if (blocked) {
    return <Blocked reason={reason} />;
  }

  return (
    <BrowserRouter>
      <SecurityTelemetry blocked={blocked} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/checkout" element={<Checkout />} />  
      </Routes>
    </BrowserRouter>
  );
}

export default App;
