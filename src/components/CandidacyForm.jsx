import { useEffect, useState } from "react";
import CountDown from "./CountDown";
import Navbar from "./Navbar";
import Footer from "./Footer";
import dropdowndata from "../utils/dropdowndata";
import axios from "axios";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { FaCircleXmark } from "react-icons/fa6";

export default function CandidacyForm() {
  const navigate = useNavigate();
  const [candidacyOpened, setCandidacyOpened] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tabActive, setTabActive] = useState("tab1");

  const loggedUser = JSON.parse(localStorage.getItem("UserData"));

  // const [closeDate, setCloseDate] = useState("");
  const [candidateData, setCandidateData] = useState({
    student_id: loggedUser?.student_id || "",
    voters_id: loggedUser?.voters_id || "",
    firstname: loggedUser?.firstname || "",
    lastname: loggedUser?.lastname || "",
    email: loggedUser?.email || "",
    department: loggedUser?.department || "",
    position: "",
    party: "",
    about_yourself: "",
    purpose: "",
    election_type: tabActive == "tab1" ? "SSG" : "BSIT",
  });

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const handleTabClick = (tab) => {
    const { position, party, about_yourself, purpose } = candidateData;
    const hasChanges = position || party || about_yourself || purpose;

    if (hasChanges) {
      const confirmSwitch = window.confirm(
        "Changes will not be saved. Do you want to continue?"
      );
      if (!confirmSwitch) return;
    }

    // Clear the form
    setCandidateData({
      student_id: loggedUser?.student_id || "",
      voters_id: loggedUser?.voters_id || "",
      firstname: loggedUser?.firstname || "",
      lastname: loggedUser?.lastname || "",
      email: loggedUser?.email || "",
      department: loggedUser?.department || "",
      position: "",
      party: "",
      about_yourself: "",
      purpose: "",
    });

    // Switch the tab
    setTabActive(tab);
  };

  const handleChanges = (e) => {
    const { name, value } = e.target;
    setCandidateData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const dept = tabActive == "tab1" ? "SSG" : "BSIT";
  const data = [
    {
      adminId: "test1",
      adminPassword: "testpass",
      closeFileDate: "2025-09-18T16:59",
      department: "SSG",
      filingStatus: "open",
    },
    {
      adminId: "test1",
      adminPassword: "testpass",
      closeFileDate: "2025-09-18T16:35",
      department: "BSIT",
      filingStatus: "closed",
    },
  ];

  const getCloseFileDate =
    tabActive == "tab1" ? data[0]?.closeFileDate : data[1]?.closeFileDate;
  const getFilingStatus =
    tabActive == "tab1" ? data[0]?.filingStatus : data[1]?.filingStatus;

  const closeDate = getCloseFileDate;

  // useEffect(() => {
  //   if (getFilingStatus === "open") {
  //     setCandidacyOpened(true);
  //     // setShowCandidacyForm(false);
  //   } else {
  //     setCandidacyOpened(false);
  //     // setShowCandidacyForm(true);
  //   }
  // }, [data]);

  // Update countdown every second
  useEffect(() => {
    // if (!candidacyOpened || !closeDate) return;

    const interval = setInterval(() => {
      const now = new Date();
      const end = new Date(closeDate);
      const diff = Math.max(0, end - now);
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      setCountdown({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [closeDate]);
  // }, [candidacyOpened, closeDate]);

  const [emptyFields, setEmptyFields] = useState({
    position: false,
    party: false,
    about_yourself: false,
    purpose: false,
  });

  const [responseMessage, setResponseMessage] = useState({
    message: "",
    type: "",
  }); // {message, type}

  const handleSubmitCandidacy = async (e) => {
    e.preventDefault();

    const requiredFields = ["position", "about_yourself", "purpose"];

    let newEmptyFields = { ...emptyFields };
    // Check if any required field is empty and mark it in the state
    requiredFields.forEach((field) => {
      newEmptyFields[field] = !candidateData[field];
    });

    setEmptyFields(newEmptyFields);

    // If any field is empty, prevent submission
    if (requiredFields.some((field) => !candidateData[field])) {
      console.log("Please fill in all required fields.");
      return;
    }
    console.log(candidateData);
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3004/smart-vote/insert-candidates",
        candidateData
      );
      if (response.data.success === true) {
        setTimeout(() => {
          setIsLoading(false);
          setResponseMessage({
            message: response.data.message || "Registration successful!",
            type: "success", // or any other type for styling
          });
          window.scrollTo({ top: 0, behavior: "smooth" });
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
          window.scrollTo({ top: 0, behavior: "smooth" });
        }, 3000);
        setTimeout(() => {
          setResponseMessage({ message: "", type: "" });
        }, 5000);
      }
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-200 overflow-auto">
      <Navbar />
      <div className="mt-20 flex justify-center">
        {getFilingStatus === "open" ? (
          <CountDown countdown={countdown} dept={dept} />
        ) : (
          <div className="text-xl mt-4 font-bold tracking-wider">
            NOT AVAILABLE
          </div>
        )}
      </div>

      {/* Centered Loader with disabled backdrop click */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-75">
          {/* Prevent interaction with content behind */}
          <div className="pointer-events-none">
            <Loader />
          </div>
        </div>
      )}

      {/* Conditionally render the response message */}
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

      {/* name of each tab group should be unique */}

      <div className="px-6 md:px-20 py-8 flex-1 flex-col justify-center">
        {/* name of each tab group should be unique */}
        <div className="">
          <button
            className={`btn border-0 rounded-none border-b-0 border-red-400 tracking-wider ${
              tabActive === "tab1" ? "btn-active border-1" : ""
            }`}
            onClick={() => handleTabClick("tab1")}
          >
            SSG Candidacy
          </button>
          <button
            className={`btn border-0 rounded-none border-b-0 border-red-400 tracking-wider  ${
              tabActive === "tab2" ? "btn-active border-1" : ""
            }`}
            onClick={() => handleTabClick("tab2")}
          >
            BSIT Candidacy
          </button>
        </div>

        {getFilingStatus != "open" ? (
          <div className="h-96 border border-gray-500 flex justify-center items-center ">
            <h1 className="text-base md:text-xl font-bold tracking-wider">
              Filing of Candidacy is not available.
            </h1>
          </div>
        ) : (
          <form action="" className="border border-gray-500 ">
            <div className="text-center text-2xl py-4 border-b-2 border-base-300 mb-2">
              {`${tabActive == "tab1" ? "SSG" : "BSIT"} Candidacy Form`}
            </div>
            <div className="w-full p-6 ">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border p-4 rounded-md">
                <div>
                  <label htmlFor="" className="text-xs">
                    Student ID
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    name="student_id"
                    placeholder="Student ID"
                    value={candidateData.student_id}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="" className="text-xs">
                    Voters ID
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    name="Voters_id"
                    placeholder="voters_id"
                    value={candidateData.voters_id}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="" className="text-xs">
                    First Name
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    name="firstname"
                    placeholder="First Name"
                    value={candidateData.firstname}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="" className="text-xs">
                    Last Name
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    name="lastname"
                    placeholder="Last Name"
                    value={candidateData.lastname}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="" className="text-xs">
                    Email
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    name="email"
                    placeholder="Email"
                    value={candidateData.email}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="" className="text-xs">
                    Department/Course
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    name="department"
                    placeholder="Department/Course"
                    value={candidateData.department}
                    readOnly
                  />
                </div>
                <div>
                  <label htmlFor="" className="text-xs">
                    Position
                  </label>
                  <select
                    type="text"
                    className={`input input-bordered w-full ${
                      emptyFields.position ? "input-error" : ""
                    }`}
                    name="position"
                    placeholder="Position"
                    value={candidateData.position || ""}
                    onChange={handleChanges}
                    required
                  >
                    <option value="">Please Select</option>
                    {tabActive === "tab1"
                      ? dropdowndata.getDepPositions().map((pos) => (
                          <option key={pos.id} value={pos.name}>
                            {pos.name}
                          </option>
                        ))
                      : dropdowndata.getSsgPositions().map((pos) => (
                          <option key={pos.id} value={pos.name}>
                            {pos.name}
                          </option>
                        ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="" className="text-xs">
                    Parties
                  </label>
                  <input
                    type="text"
                    className="input input-bordered w-full"
                    name="party"
                    placeholder="Parties/Organization"
                    value={candidateData.party}
                    onChange={handleChanges}
                  />
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm">Tell us about yourself</div>
                <textarea
                  className={`border w-full rounded-md text-sm p-4 ${
                    emptyFields.about_yourself ? "border-error" : ""
                  }`}
                  name="about_yourself"
                  placeholder="Enter a brief description"
                  value={candidateData.about_yourself || ""}
                  onChange={handleChanges}
                ></textarea>
              </div>
              <div className="mt-4">
                <div className="text-sm">Purpose of filing</div>
                <textarea
                  className={`border w-full rounded-md text-sm p-4 ${
                    emptyFields.purpose ? "border-error" : ""
                  }`}
                  name="purpose"
                  placeholder="Enter a brief description"
                  value={candidateData.purpose || ""}
                  onChange={handleChanges}
                ></textarea>
              </div>
              <div>
                <div className="text-sm">Attachments</div>
                <div className="h-24 flex justify-center items-center border-2 border-gray-400 border-dashed rounded-md">
                  Attachments
                </div>
              </div>
            </div>
            <div className="flex gap-2 justify-center p-6">
              <button className="btn btn-error" onClick={handleSubmitCandidacy}>
                Submit Candidacy
              </button>
              <button className="btn ">Clear Form</button>
            </div>
          </form>
        )}
      </div>

      <div className="mb-4">
        <Footer />
      </div>
    </div>
  );
}
