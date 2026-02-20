import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import Hero from "./components/Hero";
import Destination from "./components/Destination";

function Layout() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/" && (
        <nav className="p-3 md:p-4 border-b border-gray-700 flex flex-wrap gap-4 md:gap-6 bg-black text-white text-sm md:text-base">
          <Link to="/">Home</Link>
          <Link to="/destination/mars">Destination: Mars</Link>
        </nav>
      )}

      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/destination/:id" element={<Destination />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}

export default App;
