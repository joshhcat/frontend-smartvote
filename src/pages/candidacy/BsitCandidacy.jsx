import { useState, useEffect } from "react";
import {
  FaLayerGroup,
  FaFileSignature,
  FaCube,
  FaEye,
  FaSearch,
  FaFilter,
  FaSearchPlus,
  FaCheckCircle,
  FaChevronCircleRight,
  FaRegCheckCircle,
} from "react-icons/fa";
import CountDown from "../../components/CountDown";
import OpenFiling from "../../components/OpenFiling";
import { FaMessage, FaRegCircleXmark } from "react-icons/fa6";
import Footer from "../../components/Footer";

const initialUsers = [
  {
    id: 1,
    name: "Dio Lupa",
    status: "Pending",
    position: "Vice President",
    img: "https://img.daisyui.com/images/profile/demo/1@94.webp",
    details: "Dio Lupa is a top artist this week. Song: Remaining Reason.",
  },
  {
    id: 2,
    name: "Jane Doe",
    status: "Rejected",
    position: "President",
    img: "https://img.daisyui.com/images/profile/demo/2@94.webp",
    details: "Jane Doe's hit single Sky High is trending.",
  },
  {
    id: 3,
    name: "John Smith",
    status: "Accepted",
    position: "Auditor",
    img: "https://img.daisyui.com/images/profile/demo/3@94.webp",
    details: "John Smith released Night Drive last month.",
  },
  {
    id: 4,
    name: "Alice Blue",
    status: "Pending",
    position: "Secretary",
    img: "https://img.daisyui.com/images/profile/demo/4@94.webp",
    details: "Alice Blue's Ocean Eyes is a fan favorite.",
  },
  {
    id: 5,
    name: "Bob Green",
    status: "Accepted",
    position: "President",
    img: "https://img.daisyui.com/images/profile/demo/5@94.webp",
    details: "Bob Green's Mountain Call is climbing the charts.",
  },
  {
    id: 6,
    name: "Bob Green",
    status: "Pending",
    position: "Treasure",
    img: "https://img.daisyui.com/images/profile/demo/5@94.webp",
    details: "Bob Green's Mountain Call is climbing the charts.",
  },
];
const dept = "BSIT";

export const BsitCandidacy = () => {
  const [showCandidacyForm, setShowCandidacyForm] = useState(true);
  const [candidacyOpened, setCandidacyOpened] = useState(false);
  // const [closeDate, setCloseDate] = useState("");

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

  const [users, setUsers] = useState(initialUsers);
  const [selected, setSelected] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;
  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Filter logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "All" || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const startIdx = (currentPage - 1) * usersPerPage;
  const paginatedUsers = filteredUsers.slice(startIdx, startIdx + usersPerPage);

  const [showRejectionForm, setShowRejectionForm] = useState(false);
  // console.log(statusFilter);

  useEffect(() => {
    if (selected) {
      const modal = document.getElementById("my_modal_4");
      if (modal) {
        modal.showModal();
      }
    }
  }, [selected]);

  useEffect(() => {
    console.log("Selected changed:", selected);
  }, [selected]);

  return (
    <div className="flex flex-col min-h-screen bg-base-200 overflow-auto">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2 mt-4">
              <div className="card w-full bg-base-100 card-xs shadow-sm ">
                <div className="card-body px-6">
                  <h2 className="text-sm font-medium">Pending Candidates</h2>
                  <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-extrabold text-blue-500">
                      80
                    </h1>
                    <FaLayerGroup className="text-2xl" />
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
                </div>
              </div>

              <div className="card w-full bg-base-100 card-xs shadow-sm">
                <div className="card-body px-6">
                  <h2 className="text-sm font-medium">Accepted Candidates</h2>
                  <div className="flex items-center justify-between">
                    <h1 className="text-4xl font-extrabold text-green-500">
                      20
                    </h1>
                    <FaFileSignature className="text-2xl" />
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
                    <option value="Accepted">Accepted</option>
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
                      <th className="px-4 py-2">Position</th>
                      <th className="px-4 py-2">Status</th>
                      <th className="px-4 py-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr
                        key={user.id}
                        className="hover:bg-base-200 cursor-pointer transition"
                      >
                        <td className="flex items-center gap-2 px-4 py-2">
                          <img
                            className="size-10 rounded-box"
                            src={user.img}
                            alt={user.name}
                          />
                          <span>{user.name}</span>
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-xs uppercase font-semibold">
                            {user.position}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          {(() => {
                            const statusClass =
                              {
                                Pending: "text-blue-500",
                                Accepted: "text-green-600",
                                Rejected: "text-red-500",
                              }[user.status] || "";

                            return (
                              <span
                                className={`text-xs uppercase  ${statusClass} font-extrabold tracking-wide`}
                              >
                                {user.status}
                              </span>
                            );
                          })()}
                        </td>
                        <td className="px-4 py-2 flex gap-2">
                          <button
                            className="btn btn-sm btn-outline w-20"
                            onClick={() => setSelected(user)}
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
              {selected && (
                <div className="w-96">
                  {/* Modal Backdrop - more transparent */}
                  {/* <div
                  className="fixed inset-0 bg-black opacity-70  z-40"
                  onClick={() => setSelected(null)}
                ></div> */}
                  {/* Modal Content */}
                  <dialog id="my_modal_4" className="modal">
                    <div className="modal-box w-11/12 max-w-5xl h-auto">
                      {(() => {
                        const statusClass =
                          {
                            Pending: "text-blue-500",
                            Accepted: "text-green-600",
                            Rejected: "text-red-500",
                          }[selected?.status] || "";

                        return (
                          <span
                            className={`text-xs uppercase  ${statusClass} font-extrabold tracking-wider`}
                          >
                            {selected?.status} Candidate
                          </span>
                        );
                      })()}
                      <div className="mt-2">
                        <form method="dialog">
                          <div className="">
                            <img
                              className="size-12 rounded-box"
                              src={selected.img}
                              alt={selected.name}
                            />
                            <div>
                              <div className="font-bold text-lg">
                                {selected.name}
                              </div>
                              <div className="text-xs uppercase font-semibold opacity-60">
                                {selected.status}
                              </div>
                            </div>
                          </div>
                          <div className="text-sm">{selected.details}</div>

                          {selected?.status === "Pending" && (
                            <div className="rounded-md h-auto border mt-4 p-2 ">
                              <div className="flex flex-row gap-2 items-center p-2">
                                <FaMessage />
                                <div>Admin Review</div>
                              </div>

                              {/* Rejection  */}

                              {showRejectionForm ? (
                                <>
                                  <div className="p-2">
                                    <h2>Reason for rejection:</h2>
                                    <textarea
                                      className="border w-full h-20 rounded-md p-2 "
                                      placeholder="Please provide feedback on what needs to changed..."
                                    />
                                  </div>

                                  <div className="flex gap-4 px-2 mb-2">
                                    <button className="btn btn-error">
                                      Submit Rejection
                                    </button>
                                    <button
                                      className="btn btn-default"
                                      onClick={() =>
                                        setShowRejectionForm(false)
                                      }
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <div className="flex gap-4 px-2 mb-2">
                                  <button className="btn btn-success w-28">
                                    <span>
                                      {" "}
                                      <FaRegCheckCircle className="text-xl text-white" />
                                    </span>
                                    Approve
                                  </button>
                                  <button
                                    className="btn btn-error w-28"
                                    onClick={() => setShowRejectionForm(true)}
                                  >
                                    <span>
                                      {" "}
                                      <FaRegCircleXmark className="text-xl text-white" />
                                    </span>
                                    Reject
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* if status is rejected */}
                          {selected?.status === "Rejected" && (
                            <div className="border border-red-500 bg-red-200 h-auto p-2 mt-4 rounded-md ">
                              <div className="flex font-bold text-red-500 items-center gap-2">
                                <FaRegCircleXmark className="text-xl" />
                                Candidate Rejected
                              </div>
                              <p className="text-black mt-2 text-justify">
                                Lorem ipsum dolor sit amet consectetur,
                                adipisicing elit. Possimus alias earum quo culpa
                                expedita quibusdam, qui quae est ratione
                                delectus.
                              </p>
                            </div>
                          )}

                          {/* if there is a button, it will close the modal */}
                          <button
                            className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            onClick={() => {
                              setShowRejectionForm(false);
                              setSelected(null);
                            }}
                          >
                            ✕
                          </button>
                        </form>
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
