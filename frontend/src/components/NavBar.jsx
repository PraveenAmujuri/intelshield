import { Link, useNavigate } from "react-router-dom";

export default function NavBar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username");

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-center p-6">
      <div className="flex items-center justify-between w-full max-w-7xl px-8 py-4 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl">
        <Link to="/shop" className="text-2xl font-black tracking-tighter text-white">
          INTEL<span className="text-purple-500">SHIELD</span>
        </Link>

        <div className="flex items-center gap-8">
          <span className="text-gray-400 font-medium hidden md:inline">
            Agent: <span className="text-white">{username || "Guest"}</span>
          </span>
          <button 
            onClick={handleLogout}
            className="px-5 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500 hover:text-white transition-all"
          >
            Terminal Exit
          </button>
        </div>
      </div>
    </nav>
  );
}