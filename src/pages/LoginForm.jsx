import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Hero from "../components/Hero";
import testImage from "../assets/unsplash.jpg";
import Loader from "../components/Loader";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const [loginData, setLoginData] = useState({
    student_id: "",
    password: "",
  });

  const [error, setError] = useState(false);
  const [responseMessage, setResponseMessage] = useState({
    message: "",
    type: "",
  }); // {message, type}

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAdminLogin = async (e) => {
    if (loginData.student_id === "" || loginData.password === "") {
      setError(true);
      return;
    }

    e.preventDefault();
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3004/smart-vote/admin-login",
        {
          admin_id: loginData.student_id,
          password: loginData.password,
        }
      );
      if (response.data.success === true) {
        setTimeout(() => {
          setIsLoading(false);
          localStorage.setItem("AdminData", JSON.stringify(response.data.data));
          setResponseMessage({
            message: response.data.message || "Login successful!",
            type: "success", // or any other type for styling
          });
        }, 3000);
        setTimeout(() => {
          navigate("/admin");
        }, 5000);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          setResponseMessage({
            message: response.data.message || "Login failed.",
            type: "error",
          });
        }, 3000);
      }

      // Set a timeout to remove the responseMessage after 5 seconds
      setTimeout(() => {
        setResponseMessage({ message: "", type: "" }); // Clear message after 5 seconds
      }, 5000); // 5000 milliseconds = 5 seconds
    } catch (error) {
      console.log(error);
    }
    // Add admin login logic
  };

  const studentLogin = async (e) => {
    e.preventDefault();

    if (loginData.student_id === "" || loginData.password === "") {
      setError(true);
      return;
    }

    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3004/smart-vote/voters-login",
        loginData
      );
      if (response.data.success === true) {
        setTimeout(() => {
          setIsLoading(false);
          localStorage.setItem("UserData", JSON.stringify(response.data.data));
          setResponseMessage({
            message: response.data.message || "Login successful!",
            type: "success", // or any other type for styling
          });
        }, 3000);
        setTimeout(() => {
          navigate("/student/homepage");
        }, 5000);
      } else {
        setTimeout(() => {
          setIsLoading(false);
          setResponseMessage({
            message: response.data.message || "Login failed.",
            type: "error",
          });
        }, 3000);
      }

      // Set a timeout to remove the responseMessage after 5 seconds
      setTimeout(() => {
        setResponseMessage({ message: "", type: "" }); // Clear message after 5 seconds
      }, 5000); // 5000 milliseconds = 5 seconds
    } catch (error) {
      console.log(error);
    }

    // setIsLoading(true);
    // setTimeout(() => {
    //   localStorage.setItem("User", "Student");
    //   navigate("/student/homepage");

    //   setIsLoading(false);
    // }, 10000);
  };

  // const handleLogin = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   try {
  //     // perform login
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-500 to-black">
      {/* Centered Loader with disabled backdrop click */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-75">
          {/* Prevent interaction with content behind */}
          <div className="pointer-events-none">
            <Loader />
          </div>
        </div>
      )}

      {/* Main Login Card & Side Info Section */}
      <div className="flex min-h-screen">
        {/* Login Card */}
        <div className="w-full md:w-1/2 flex items-center justify-center p-4">
          <div className="card w-96 bg-base-100 shadow-xl z-10">
            {/* Conditionally render the response message */}

            <div className="card-body">
              <h2 className="card-title justify-center text-2xl tracking-widest">
                Smart Vote
              </h2>
              {responseMessage.message && (
                <div className="flex justify-center mt-4 px-2">
                  <div
                    className={`alert w-72 md:w-86 ${
                      responseMessage.type === "success"
                        ? "alert-success"
                        : "alert-error"
                    }`}
                  >
                    {responseMessage.type === "success" ? (
                      <FaCheckCircle />
                    ) : (
                      <FaCircleXmark />
                    )}

                    <span>{responseMessage.message}</span>
                  </div>
                </div>
              )}
              <form className="space-y-4 mt-6">
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    error ? "input-error" : ""
                  }`}
                  placeholder="ID"
                  name="student_id"
                  value={loginData.student_id || ""}
                  onChange={handleChange}
                  required
                />
                <input
                  type="password"
                  className={`input input-bordered w-full ${
                    error ? "input-error" : ""
                  }`}
                  placeholder="Password"
                  name="password"
                  value={loginData.password || ""}
                  onChange={handleChange}
                  required
                />
                <button
                  type="submit"
                  className="btn btn-primary w-full"
                  onClick={studentLogin}
                >
                  Login as Student
                </button>
                <button
                  type="button"
                  className="btn btn-outline bg-orange-700 text-white w-full"
                  onClick={handleAdminLogin}
                >
                  Login as Admin
                </button>
              </form>
              <div className="text-center w-full mt-4">
                Don't have an account?&nbsp;
                <Link
                  to="/register"
                  className="link link-hover font-medium text-blue-600"
                >
                  Register
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side Info Section */}
        <div className="relative w-1/2 py-8 px-12 hidden md:flex flex-col overflow-hidden">
          {/* Background image */}
          <img
            src={testImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover z-1 opacity-40 blur-xs"
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-black opacity-5 z-0"></div>

          {/* Text content */}
          <div className="relative z-20 mt-20 text-4xl font-bold tracking-wider text-white">
            "Empowering Every Student Voice — Vote Anytime, Anywhere."
          </div>
          <div className="relative z-20 mt-10 text-justify text-2xl font-bold italic text-white">
            Welcome to Smart Vote
          </div>
          <div className="text-base mt-4 text-justify text-white">
            The innovative online voting system designed to streamline and
            secure the election process for our school community. With Smart
            Vote, students can easily register as voters,
          </div>
        </div>
      </div>
    </div>
  );
}
