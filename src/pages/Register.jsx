import { useState } from "react";
import { Link } from "react-router-dom";
import testImage from "../assets/unsplash.jpg";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";
export default function Register() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [formData, setFormData] = useState({
    student_id: "",
    firstname: "",
    lastname: "",
    department: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const [emptyFields, setEmptyFields] = useState({
    student_id: false,
    firstname: false,
    lastname: false,
    department: false,
    email: false,
    password: false,
  });

  const [responseMessage, setResponseMessage] = useState({
    message: "",
    type: "",
  }); // {message, type}

  const handleRegister = async (e) => {
    e.preventDefault();

    const requiredFields = [
      "student_id",
      "firstname",
      "lastname",
      "department",
      "email",
      "password",
    ];

    let newEmptyFields = { ...emptyFields };
    // Check if any required field is empty and mark it in the state
    requiredFields.forEach((field) => {
      newEmptyFields[field] = !formData[field];
    });

    setEmptyFields(newEmptyFields);

    // If any field is empty, prevent submission
    if (requiredFields.some((field) => !formData[field])) {
      console.log("Please fill in all required fields.");
      return;
    }

    // Add registration logic here

    try {
      const response = await axios.post(
        "http://localhost:3004/smart-vote/voters",
        formData
      );
      console.log(response.data);
      if (response.data.success === true) {
        setResponseMessage({
          message: response.data.message || "Registration successful!",
          type: "success", // or any other type for styling
        });

        setFormData({
          student_id: "",
          firstname: "",
          lastname: "",
          department: "",
          email: "",
          password: "",
        });
      } else {
        setResponseMessage({
          message: response.data.message || "Registration failed.",
          type: "error",
        });
      }

      // Set a timeout to remove the responseMessage after 5 seconds
      setTimeout(() => {
        setResponseMessage({ message: "", type: "" }); // Clear message after 5 seconds
      }, 5000); // 5000 milliseconds = 5 seconds
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-gray-500 to-black">
      <div className="flex min-h-screen ">
        <div className="w-full md:w-1/2 flex items-center justify-center p-4 ">
          <div className="card w-96 bg-base-100 shadow-xl z-10">
            {/* Conditionally render the response message */}
            {responseMessage.message && (
              <div className="flex justify-center mt-4 px-4">
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
            <div className="card-body">
              {/* <h2 className="card-title justify-center">Register</h2> */}
              <form onSubmit={handleRegister} className="space-y-4 ">
                <div className="text-center text-xl font-bold tracking-wider">
                  Voters Registration
                </div>
                <input
                  type="text"
                  placeholder="ID"
                  className={`input input-bordered w-full ${
                    emptyFields.student_id ? "input-error" : ""
                  }`}
                  name="student_id"
                  value={formData.student_id || ""}
                  onChange={handleChange}
                  // required
                />
                <input
                  type="text"
                  placeholder="First Name"
                  className={`input input-bordered w-full ${
                    emptyFields.firstname ? "input-error" : ""
                  }`}
                  name="firstname"
                  value={formData.firstname || ""}
                  onChange={handleChange}
                  // required
                />
                <input
                  type="text"
                  placeholder="Last Name"
                  className={`input input-bordered w-full ${
                    emptyFields.lastname ? "input-error" : ""
                  }`}
                  name="lastname"
                  value={formData.lastname || ""}
                  onChange={handleChange}
                  // required
                />
                <input
                  type="text"
                  placeholder="Department"
                  className={`input input-bordered w-full ${
                    emptyFields.email ? "input-error" : ""
                  }`}
                  name="department"
                  value={formData.department || ""}
                  onChange={handleChange}
                  // required
                />
                <input
                  type="text"
                  placeholder="Email"
                  className={`input input-bordered w-full ${
                    emptyFields.email ? "input-error" : ""
                  }`}
                  name="email"
                  value={formData.email || ""}
                  onChange={handleChange}
                  // required
                />
                <input
                  type="password"
                  placeholder="Password"
                  className={`input input-bordered w-full ${
                    emptyFields.password ? "input-error" : ""
                  }`}
                  name="password"
                  value={formData.password || ""}
                  onChange={handleChange}
                  // required
                />
                {/* <input
                  type="password"
                  placeholder="Confirm Password"
                  className="input input-bordered w-full"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  required
                /> */}
                <button type="submit" className="btn btn-primary w-full">
                  Register
                </button>
              </form>
              <div className="text-center w-full mt-4">
                Already have an account?&nbsp;
                <Link
                  to="/login"
                  className="link link-hover font-medium text-blue-600"
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="relative w-1/2 py-8 px-12 hidden md:flex flex-col overflow-hidden">
          {/* Background image */}
          <img
            src={testImage}
            alt=""
            className="absolute inset-0 w-full h-full object-cover z-1 opacity-40 blur-xs"
          />

          {/* Overlay (optional for readability) */}
          <div className="absolute inset-0 bg-black opacity-5 z-0"></div>

          {/* Text content */}
          <div className="relative z-20 mt-20 text-4xl font-bold tracking-wider text-white">
            "Empowering Every Student Voice — Vote Anytime, Anywhere."
          </div>
          <div className="relative z-20 mt-10 text-justify text-md text-2xl font-bold italic text-white ">
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
