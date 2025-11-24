import { useState } from "react";
import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import Footer from "./Footer";
export default function Hero() {
  const [showToast, setShowToast] = useState(false);

  const navigate = useNavigate();
  return (
    <div className="flex flex-col min-h-screen bg-base-200 overflow-auto">
      {/* Navbar */}
      <Navbar />

      {/* Main Content area grows to fill available space */}
      <main className="flex-1 flex justify-center items-center min-h-[calc(100vh-6rem)] relative">
        {/* Toast Message */}
        <div
          className={`toast toast-top toast-end mt-10 transition-all duration-500 ease-in-out ${
            showToast
              ? "opacity-100 translate-y-0"
              : "opacity-0 -translate-y-4 pointer-events-none"
          }`}
        >
          <div className="alert alert-error shadow-lg">
            <span>SSG filing is not available at the moment</span>
          </div>
        </div>

        <div className="hero-content text-center">
          <div className="max-w-md">
            <h1 className="text-5xl font-bold">Hello there</h1>
            <p className="py-6">
              Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
              excepturi exercitationem quasi. In deleniti eaque aut repudiandae
              et a id nisi.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                className="btn btn-secondary w-36"
                onClick={() => navigate("/student/file-candidacy")}
              >
                File Candidacy
              </button>
              <button
                className="btn btn-success w-36"
                onClick={() => navigate("/student/election/voting")}
              >
                Vote Now
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer stays at the bottom */}
      <div className="mb-4">
        <Footer />
      </div>
    </div>
  );
}
