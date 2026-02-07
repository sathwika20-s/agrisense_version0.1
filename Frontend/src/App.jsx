import { NavLink, Route, Routes, useLocation } from "react-router-dom";
import Dashboard from "./pages/Dashboard.jsx";
import ClimateInsights from "./pages/ClimateInsights.jsx";
import CropAdvisor from "./pages/CropAdvisor.jsx";
import DiseaseScanner from "./pages/DiseaseScanner.jsx";
import SmartChat from "./pages/SmartChat.jsx";

function Sidebar() {
  const location = useLocation();

  const navItems = [
    {
      to: "/",
      label: "Overview",
      icon: "⌂",
      meta: "Farm cockpit",
    },
    {
      to: "/climate",
      label: "Climate",
      icon: "⛅",
      meta: "Live weather & zone",
    },
    {
      to: "/crops",
      label: "Crop advisor",
      icon: "🌱",
      meta: "Best crops now",
    },
    {
      to: "/disease",
      label: "Disease scanner",
      icon: "🩺",
      meta: "Upload leaf photo",
    },
    {
      to: "/chat",
      label: "Smart chatbot",
      icon: "🤖",
      meta: "Ask anything",
    },
  ];

  const currentPath = location.pathname;
  const activeItem =
    navItems.find((item) =>
      item.to === "/"
        ? currentPath === "/"
        : currentPath.startsWith(item.to)
    ) || navItems[0];

  return (
    <aside className="sidebar">
      <div className="sidebar-inner">
        <div className="brand">
          <div className="brand-main">
            <div className="brand-logo">
              <span>AG</span>
            </div>
            <div>
              <div className="brand-text-title">Smart Agri Studio</div>
              <div className="brand-text-sub">
                One cockpit for your farm decisions
              </div>
            </div>
          </div>
          <div className="brand-chip">v1 · local backend</div>
        </div>

        <nav className="nav">
          <div className="nav-group-label">Workspace</div>
          <div className="nav-list">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  [
                    "nav-link nav-link-main",
                    isActive ? "active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")
                }
                end={item.to === "/"}
              >
                <span>
                  <span className="nav-link-icon">{item.icon}</span>
                  <span className="nav-link-label">{item.label}</span>
                </span>
                <span className="nav-link-meta">{item.meta}</span>
              </NavLink>
            ))}
          </div>

          <div style={{ marginTop: "0.6rem" }}>
            <div className="nav-group-label">Status</div>
            <div className="nav-list">
              <div className="nav-link">
                <span>
                  <span className="nav-link-icon">
                    <span className="badge-dot-green" />
                  </span>
                  <span className="nav-link-label">Backend</span>
                </span>
                <span className="nav-link-meta mono">
                  {import.meta.env.VITE_BACKEND_URL}/api
                </span>
              </div>
              <div className="nav-link">
                <span>
                  <span className="nav-link-icon">
                    <span className="badge-dot-blue" />
                  </span>
                  <span className="nav-link-label">Environment</span>
                </span>
                <span className="nav-link-meta">Local development</span>
              </div>
            </div>
          </div>
        </nav>

        <div className="nav-footer">
          <div className="nav-footer-row">
            <span className="nav-footer-label">Today&apos;s focus</span>
            <span className="nav-footer-pill">Plan · Decide · Act</span>
          </div>
          <div className="nav-footer-status">
            <span className="badge-dot-amber" />
            <span>Use climate → crops → chatbot for full workflow.</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

function App() {
  return (
    <div className="shell">
      <Sidebar />
      <main className="content">
        <div className="content-inner">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/climate" element={<ClimateInsights />} />
            <Route path="/crops" element={<CropAdvisor />} />
            <Route path="/disease" element={<DiseaseScanner />} />
            <Route path="/chat" element={<SmartChat />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
