import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import { use, useState } from "react";
import LoginForm from "./pages/LoginForm";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import { SsgCandidacy } from "./pages/candidacy/SsgCandidacy";
import AdminSidebar from "./components/Sidebar/AdminSidebar";
import { FaBars } from "react-icons/fa";
import { FaXmark } from "react-icons/fa6";
import { BsitCandidacy } from "./pages/candidacy/BsitCandidacy";
import { SsgElection } from "./pages/election/SsgElection";
import StudentSidebar from "./components/Sidebar/StudentSidebar";
import StudentDashboard from "./pages/SmartvoteElection";
import CandidacyHistory from "./components/CandidacyHistory";
import Hero from "./components/Hero";
import CandidacyForm from "./components/CandidacyForm";
import SmartvoteElection from "./pages/SmartvoteElection";
import UserManagement from "./pages/UserManagement";
import ElectionReceipt from "./components/ElectionReceipt";

function App() {
  const location = useLocation();
  // const hideSidebar =
  //   ["/login", "/register"].includes(location.pathname);
  // const hideSidebar = location.pathname.startsWith(
  //   "/login",
  //   "/register",
  //   "/student"
  // );

  const hideSidebar = ["/login", "/register", "/student"].some((prefix) =>
    location.pathname.startsWith(prefix)
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleBurgerClick = () => {
    if (mobileOpen) {
      setMobileOpen(false);
    } else {
      setMobileOpen(true);
    }
  };

  const userRole = localStorage.getItem("User");

  return (
    <div className="relative bg-base-200 min-h-screen">
      {/* Hamburger for mobile */}
      {!hideSidebar && (
        <div className="md:hidden fixed top-4 left-4 z-50">
          {mobileOpen ? (
            <FaXmark
              className="transition-all h-8 duration-300 opacity-100 scale-100 btn btn-square btn-ghost"
              onClick={handleBurgerClick}
            />
          ) : (
            <FaBars
              className="transition-all h-8 duration-300 opacity-100 scale-100 btn btn-square btn-ghost"
              onClick={handleBurgerClick}
            />
          )}
        </div>
      )}
      {/* Render sidebar only if not hidden */}
      {!hideSidebar && (
        <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      )}

      {/* {!hideSidebar &&
        (userRole == "Admin" ? (
          <AdminSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
        ) : (
          <StudentSidebar
            mobileOpen={mobileOpen}
            setMobileOpen={setMobileOpen}
          />
        ))} */}

      <div className={hideSidebar ? "" : "md:ml-64"}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/student/homepage" element={<Hero />} />
          <Route path="/admin/candidacy/ssg" element={<SsgCandidacy />} />
          <Route path="/admin/candidacy/bsit" element={<BsitCandidacy />} />
          <Route path="/admin/election/ssg" element={<SsgElection />} />
          <Route path="/admin/user-management" element={<UserManagement />} />
          <Route
            path="/student/candidacy/history"
            element={<CandidacyHistory />}
          />
          <Route path="/student/file-candidacy" element={<CandidacyForm />} />
          <Route
            path="/student/election/voting"
            element={<SmartvoteElection />}
          />
          <Route
            path="/student/election/history"
            element={<ElectionReceipt />}
          />

          {/* Add more routes here */}
        </Routes>
      </div>
    </div>
  );
}

export default App;
