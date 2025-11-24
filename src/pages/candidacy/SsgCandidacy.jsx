import { useState, useEffect } from "react";
import {
  FaLayerGroup,
  FaFileSignature,
  FaCube,
  FaEye,
  FaSearch,
  FaFilter,
  FaRegCheckCircle,
  FaCheckCircle,
} from "react-icons/fa";
import CountDown from "../../components/CountDown";
import OpenFiling from "../../components/OpenFiling";
import { FaCircleXmark, FaMessage, FaRegCircleXmark } from "react-icons/fa6";
import Footer from "../../components/Footer";
import axios from "axios";
import Loader from "../../components/Loader";

const dept = "SSG";

export const SsgCandidacy = () => {
  const [showCandidacyForm, setShowCandidacyForm] = useState(true);
  const [candidacyOpened, setCandidacyOpened] = useState(false);
  // const [closeDate, setCloseDate] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [error, setError] = useState(false);
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [responseMessage, setResponseMessage] = useState({
    message: "",
    type: "",
  });
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const data = JSON.parse(localStorage.getItem("candidacyData"));
  const closeDate = data?.closeFileDate;
  useEffect(() => {
    if (data && data.filingStatus === "open") {
      setCandidacyOpened(true);
      setShowCandidacyForm(false);
    } else {
      setCandidacyOpened(false);
      setShowCandidacyForm(true);
    }
  }, [data]);

  // Update countdown every second
  useEffect(() => {
    if (!candidacyOpened || !closeDate) return;

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
  }, [candidacyOpened, closeDate]);

  const candidatesPerPage = 5;
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  //* Get Candidates
  const getCandidate = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3004/smart-vote/get-candidates/${dept}`
      );

      if (response.data.success === true) {
        setCandidates(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    getCandidate();
  }, []);

  // Filter logic
  const filteredCandidates = candidates.filter((candidate) => {
    const matchesSearch =
      candidate.firstname +
      candidate.lastname.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || candidate.status === statusFilter.toUpperCase();
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredCandidates.length / candidatesPerPage);
  const startIdx = (currentPage - 1) * candidatesPerPage;
  const paginatedCandidates = filteredCandidates.slice(
    startIdx,
    startIdx + candidatesPerPage
  );

  const [showRejectionForm, setShowRejectionForm] = useState(false);
  //console.log(statusFilter);
  useEffect(() => {
    if (selectedCandidate) {
      const modal = document.getElementById("my_modal_4");
      if (modal) {
        modal.showModal();
      }
    }
  }, [selectedCandidate]);

  const handleApproveClick = () => {
    setStatus("APPROVED"); // Set the status to "APPROVED"
    setRemarks("This candidate was approved");
  };

  const handleRejectClick = () => {
    if (remarks.trim() === "") {
      setError(true);
      return; // Don't proceed with any further logic if remarks are empty
    }
    setStatus("REJECTED"); // Set the status to "REJECTED"
  };

  const updateCandidate = async () => {
    document.getElementById("my_modal_4").close();
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:3004/smart-vote/update-candidate",
        {
          student_id: selectedCandidate.student_id,
          status: status,
          remarks: remarks,
        }
      );
      if (response.data.success === true) {
        setTimeout(() => {
          setIsLoading(false);
          setSelectedCandidate(null);
          setResponseMessage({
            message: response.data.message,
            type: "success",
          });
          setRemarks("");
        }, 3000);
        setTimeout(() => {
          setResponseMessage({ message: "", type: "" }); // Clear message after 5 seconds
          getCandidate();
        }, 5000); // 5000 milliseconds = 5 seconds
      } else {
        setTimeout(() => {
          setIsLoading(false);
          setResponseMessage({
            message: response.data.message,
            type: "error",
          });
        }, 3000);
        // Set a timeout to remove the responseMessage after 5 seconds
        setTimeout(() => {
          setResponseMessage({ message: "", type: "" }); // Clear message after 5 seconds
        }, 5000); // 5000 milliseconds = 5 seconds
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (status && remarks.trim() !== "") {
      updateCandidate(); // Call updateCandidate only if remarks are not empty
    }
  }, [status]); // Trigger when status or remarks change

  return (
    <div className="flex flex-col min-h-screen bg-base-200 overflow-auto">
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-75">
          {/* Prevent interaction with content behind */}
          <div className="pointer-events-none">
            <Loader />
          </div>
        </div>
      )}

      <div className="flex-1 p-8">
        {/* Election Form */}

        {showCandidacyForm && (
          <OpenFiling
            dept={dept}
            setCandidacyOpened={setCandidacyOpened}
            setShowCandidacyForm={setShowCandidacyForm}
          />
        )}

        {!showCandidacyForm && (
          <div className="flex flex-col mb-6 w-full">
            <CountDown countdown={countdown} dept={dept} />
            {responseMessage.message && (
              <div className="flex justify-center px-4">
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
            )}{" "}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2 mt-4">
              <div className="card w-full bg-base-100 card-xs shadow-sm">
                <div className="card-body px-6">
                  <h2 className="text-sm font-medium">Pending Candidates</h2>
                  <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-extrabold text-blue-500">
                      80
                    </h1>
                    <FaLayerGroup className="text-2xl" />
                  </div>
                  <div>Departments</div>
                  <div>
                    <div className="font-bold tracking-wider">
                      CCS - 12, CTE - 15, CBA - 20, PSYCH - 10, CJE- 8
                    </div>
                  </div>
                </div>
              </div>
              <div className="card w-full bg-base-100 card-xs shadow-sm ">
                <div className="card-body px-6">
                  <h2 className="text-sm font-medium">Rejected Candidates</h2>
                  <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-extrabold text-red-500">34</h1>
                    <FaCube className="text-2xl" />
                  </div>
                  <div>Departments</div>
                  <div>
                    <div className="font-bold tracking-wider">
                      CCS - 12, CTE - 15, CBA - 20, PSYCH - 10, CJE- 8
                    </div>
                  </div>
                </div>
              </div>

              <div className="card w-full bg-base-100 card-xs shadow-sm ">
                <div className="card-body px-6">
                  <h2 className="text-sm font-medium">Accepted Candidates</h2>
                  <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-extrabold text-green-500">
                      20
                    </h1>
                    <FaFileSignature className="text-2xl" />
                  </div>
                  <div>Departments</div>
                  <div>
                    <div className="font-bold tracking-wider">
                      CCS - 12, CTE - 15, CBA - 20, PSYCH - 10, CJE- 8
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* User List and Details */}
            <div className="w-full mt-4 ">
              {/* Search and Filter Bar */}
              <div className="flex justify-between items-center mb-4 gap-2">
                {/* Search Bar with Icon */}
                <div className="relative w-full max-w-xs">
                  <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                  <input
                    type="text"
                    placeholder="Search by name..."
                    className="input input-bordered w-full pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                {/* Filter Dropdown with Icon */}
                <div className="relative w-full max-w-xs">
                  <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10" />
                  <select
                    className="select select-bordered w-full pl-10"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
              </div>
              {/* Table */}
              <div className="overflow-x-auto">
                <table className="table bg-base-100 rounded-box shadow-md w-full">
                  <thead>
                    <tr>
                      <th className="px-4 py-2">Name</th>
                      <th className="px-4 py-2">Department</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedCandidates.map((candidate) => (
                      <tr
                        key={candidate.id}
                        className="hover:bg-base-200 cursor-pointer transition"
                      >
                        <td className="flex items-center gap-2 px-4 py-2">
                          {/* <img
                            className="size-10 rounded-box"
                            src={candidate.img}
                            alt={candidate.name}
                          /> */}
                          <span>
                            {candidate.firstname + " " + candidate.lastname}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-xs uppercase font-semibold">
                            {candidate.department}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {(() => {
                            const statusClass =
                              {
                                PENDING: "text-blue-500",
                                APPROVED: "text-green-600",
                                REJECTED: "text-red-500",
                              }[candidate.status] || "";

                            return (
                              <span
                                className={`text-xs uppercase  ${statusClass} font-extrabold tracking-wide`}
                              >
                                {candidate.status}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          <button
                            className="btn btn-sm btn-outline w-20"
                            onClick={() => setSelectedCandidate(candidate)}
                          >
                            <span>
                              <FaEye />
                            </span>
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Pagination Controls */}
              <div className="flex justify-center items-center gap-2 mt-4">
                <button
                  className="btn btn-sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Prev
                </button>
                <span className="px-2">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="btn btn-sm"
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </button>
              </div>
              {selectedCandidate && (
                <div className="w-96">
                  {/* Modal Backdrop - more transparent */}
                  {/* <div
                  className="fixed inset-0 bg-black opacity-70  z-40"
                  onClick={() => setSelectedCandidate(null)}
                ></div> */}
                  {/* Modal Content */}
                  <dialog id="my_modal_4" className="modal">
                    <div className="modal-box w-11/12 max-w-5xl h-auto">
                      {(() => {
                        const statusClass =
                          {
                            PENDING: "text-blue-500",
                            APPROVED: "text-green-600",
                            REJECTED: "text-red-500",
                          }[selectedCandidate?.status] || "";

                        return (
                          <span
                            className={`text-md uppercase ${statusClass} font-extrabold tracking-wider`}
                          >
                            {selectedCandidate?.status} Candidate
                          </span>
                        );
                      })()}
                      <div className="mt-2">
                        {/* <form method="dialog"> */}
                        <div className="">
                          {/* <img
                              className="size-12 rounded-box"
                              src={selectedCandidate.img}
                              alt={selectedCandidate.name}
                            /> */}
                          <div>
                            <div className="text-sm">
                              Name :{" "}
                              <span className="font-medium text-lg">
                                {" "}
                                {selectedCandidate.firstname +
                                  " " +
                                  selectedCandidate.lastname}
                              </span>
                            </div>
                          </div>
                          <div>
                            <div className="text-sm">
                              Position filed :{" "}
                              <span className="">
                                {" "}
                                {selectedCandidate.position}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm">
                          Candidate Detail : {selectedCandidate.about_yourself}
                        </div>
                        <div className="text-sm">
                          Purpose of filing: {selectedCandidate.purpose}
                        </div>

                        {selectedCandidate?.status === "PENDING" && (
                          <div className="rounded-md h-auto border mt-4 p-2 ">
                            <div className="flex flex-row gap-2 items-center p-2">
                              <FaMessage />
                              <div className="text-sm">Admin Review</div>
                            </div>

                            {/* Rejection  */}

                            {showRejectionForm ? (
                              <>
                                <div className="p-2 text-sm">
                                  <h2>Reason for rejection:</h2>
                                  <textarea
                                    name="remarks"
                                    value={remarks}
                                    className={`border w-full h-20 rounded-md p-2 ${
                                      error ? "border-red-400" : ""
                                    }`}
                                    placeholder="Please provide feedback on what needs to changed..."
                                    onChange={(e) => setRemarks(e.target.value)}
                                  />
                                </div>

                                <div className="flex gap-4 px-2 mb-2">
                                  <div
                                    className="btn btn-error"
                                    onClick={handleRejectClick}
                                  >
                                    Submit Rejection
                                  </div>
                                  <div
                                    className="btn btn-default"
                                    onClick={() => setShowRejectionForm(false)}
                                  >
                                    Cancel
                                  </div>
                                </div>
                              </>
                            ) : (
                              <div className="flex gap-4 px-2 mb-2">
                                <div
                                  className="btn btn-success w-28"
                                  onClick={handleApproveClick}
                                >
                                  <span>
                                    {" "}
                                    <FaRegCheckCircle className="text-xl text-white" />
                                  </span>
                                  Approve
                                </div>
                                <div
                                  className="btn btn-error w-28"
                                  onClick={() => setShowRejectionForm(true)}
                                >
                                  <span>
                                    {" "}
                                    <FaRegCircleXmark className="text-xl text-white" />
                                  </span>
                                  Reject
                                </div>
                              </div>
                            )}
                          </div>
                        )}

                        {/* if status is rejected */}
                        {selectedCandidate?.status === "REJECTED" && (
                          <div className="border border-red-500 bg-red-200 h-auto p-2 mt-4 rounded-md ">
                            <div className="flex font-bold text-red-500 items-center gap-2">
                              <FaRegCircleXmark className="text-xl" />
                              Candidate Rejected
                            </div>
                            <p className="text-black mt-2 text-justify">
                              {selectedCandidate.approver_remarks}
                            </p>
                          </div>
                        )}

                        {/* if there is a button, it will close the modal */}
                        <button
                          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                          onClick={() => {
                            setShowRejectionForm(false);
                            setSelectedCandidate(null);
                          }}
                        >
                          ✕
                        </button>
                        {/* </form> */}
                      </div>
                    </div>
                  </dialog>
                </div>
              )}
            </div>
          </div>
        )}
        {/* Countdown */}
      </div>
      <div className="mb-4">
        <Footer />
      </div>
    </div>
  );
};
