import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { getProfile } from "./api";
import Footer from "./components/Footer.jsx";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import ProjectDetail from "./pages/ProjectDetail.jsx";
import { ProfileContext } from "./ProfileContext.js";
import useApi from "./useApi.js";

// Scroll to /#section links, or to the top on a new page.
function ScrollManager() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (hash) {
      // wait one tick so the section exists after the page renders
      setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 50);
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);
  return null;
}

export default function App() {
  const { data: profile, error, loading } = useApi(getProfile, []);

  if (loading) {
    return <p className="p-10 text-center text-slate-400">Loading...</p>;
  }

  if (error || !profile) {
    return (
      <div className="mx-auto max-w-xl p-10 text-center">
        <h1 className="text-2xl font-bold text-white">Could not load the portfolio</h1>
        <p className="mt-3 text-slate-300">
          {error?.status === 404
            ? "Profile is not created yet. Add it in the Django admin (/admin/)."
            : "The backend is not reachable. Start Django on port 8000 and check CORS settings."}
        </p>
      </div>
    );
  }

  return (
    <ProfileContext.Provider value={profile}>
      <ScrollManager />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route
          path="*"
          element={<p className="p-10 text-center text-slate-300">Page not found.</p>}
        />
      </Routes>
      <Footer />
    </ProfileContext.Provider>
  );
}
