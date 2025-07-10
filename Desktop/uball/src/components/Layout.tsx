import { Outlet, Link } from "react-router-dom";
import logo from "../assets/logo3.png";

export default function Layout() {
  return (
    <div className="bg-[#0e0e0e] min-h-screen text-white">
      <header className="sticky top-0 z-50 bg-[#1c1c1e] px-6 py-0 shadow-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img src={logo} alt="Uball logo" className="h-28" />
          <span className="text-white font-bold text-lg"></span>
        </div>

        <nav className="flex gap-5 text-la font-large text-white">
          <Link to="/" className="hover:text-gray-300">Live</Link>
          <Link to="#" className="hover:text-gray-300">Ligaer</Link>
          <Link to="#" className="hover:text-gray-300">Transfers</Link>
          <Link to="#" className="hover:text-gray-300">Favoritter</Link>
          <Link to="/league/premier-league" className="hover:text-gray-300">Ligaer</Link>
        </nav>
      </header>

      <main className="px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
