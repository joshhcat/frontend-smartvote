import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { FaChevronCircleLeft, FaChevronLeft } from "react-icons/fa";
import { FaArrowLeftLong } from "react-icons/fa6";
import CountDown from "../components/CountDown";
import ElectionCountdown from "../components/ElectionCountdown";
import Footer from "../components/Footer";

export default function SmartvoteElection() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [role, setRole] = useState("president"); // Added role state

  // Data for each role, you can customize as needed
  const roleData = {
    president: [
      {
        id: 1,
        title: "Party A",
        image:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, atque perspiciatis cupiditate fuga soluta tenetur in laudantium tempore incidunt voluptatem. Natus facilis cupiditate omnis itaque nesciunt possimus aliquam nulla aliquid?",
      },
      {
        id: 2,
        title: "Party B",
        image:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        description:
          "Lorem ipsum dolor sit amet consectetur adipisicing elit. Accusantium, atque perspiciatis cupiditate fuga soluta tenetur in laudantium tempore incidunt voluptatem. Natus facilis cupiditate omnis itaque nesciunt possimus aliquam nulla aliquid?.",
      },
    ],
    "vice-president": [
      {
        id: 3,
        title: "Party C",
        image:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        description:
          "Vice President candidate info. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
      {
        id: 4,
        title: "Party C",
        image:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        description:
          "Vice President candidate info. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
    ],
    secretary: [
      {
        id: 6,
        title: "Party D",
        image:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        description:
          "Secretary candidate info. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
      {
        id: 5,
        title: "Party D",
        image:
          "https://img.daisyui.com/images/stock/photo-1606107557195-0e29a4b5b4aa.webp",
        description:
          "Secretary candidate info. Lorem ipsum dolor sit amet consectetur adipisicing elit.",
      },
    ],
  };

  // Map role to display text
  const roleDisplayName = {
    president: "-- PRESIDENT --",
    "vice-president": "-- VICE PRESIDENT --",
    secretary: "-- SECRETARY --",
  };
  const [showVotersForm, setShowVotersForm] = useState(false);
  // Handle Next button click
  const handleNext = () => {
    switch (role) {
      case "president":
        setRole("vice-president");
        break;
      case "vice-president":
        setRole("secretary");
        break;
      case "secretary":
        // setRole("secretary");
        setShowVotersForm(true);

        break;
      default:
        setRole("president");
    }
    setActiveCard(null); // close modal if open when switching role
  };

  // Handle Previous button click
  const handlePrevious = () => {
    switch (role) {
      case "president":
        setRole("president");
        break;
      case "vice-president":
        setRole("president");
        break;
      case "secretary":
        setRole("vice-president");
        break;
      default:
        setRole("president");
    }
    setActiveCard(null); // close modal if open when switching role
  };

  const cards = roleData[role];

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  const [tabActive, setTabActive] = useState("tab1");
  const handleTabClick = (tab) => {
    // Switch the tab
    setTabActive(tab);
  };

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
      closeFileDate: "2025-09-18T16:40",
      department: "BSIT",
      filingStatus: "open",
    },
  ];

  const getCloseElectionDate =
    tabActive == "tab1" ? data[0]?.closeFileDate : data[1]?.closeFileDate;
  const getFilingStatus =
    tabActive == "tab1" ? data[0]?.filingStatus : data[1]?.filingStatus;

  const closeDate = getCloseElectionDate;

  const dept = tabActive == "tab1" ? "SSG" : "BSIT";

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

  return (
    <div className="min-h-screen bg-base-200 w-full overflow-auto">
      <Navbar />
      <div className="mt-20 flex justify-center">
        {getFilingStatus === "open" ? (
          <ElectionCountdown countdown={countdown} dept={dept} />
        ) : (
          <div className="text-xl mt-4 font-bold tracking-wider">
            NOT AVAILABLE
          </div>
        )}
      </div>
      <div className="px-6 md:px-20 py-8 flex flex-col justify-center">
        <div className="">
          <button
            className={`btn border-0 rounded-none border-b-0 border-red-400 tracking-wider ${
              tabActive === "tab1" ? "btn-active border-1" : ""
            }`}
            onClick={() => handleTabClick("tab1")}
          >
            SSG Election
          </button>
          <button
            className={`btn border-0 rounded-none border-b-0 border-red-400 tracking-wider ${
              tabActive === "tab2" ? "btn-active border-1" : ""
            }`}
            onClick={() => handleTabClick("tab2")}
          >
            BSIT Election
          </button>
        </div>
        {getFilingStatus != "open" ? (
          <div className="h-96 border border-gray-500 flex justify-center items-center">
            <div className="font-semibold tracking-wider text-xl">
              Election is not available
            </div>
          </div>
        ) : (
          <>
            {showVotersForm ? (
              <div className="relative flex items-center justify-center w-full p-4 border border-gray-500">
                <div
                  className=" absolute top-0 left-0 p-2 flex items-center gap-2 cursor-pointer hover:scale-105 w-fit"
                  onClick={() => setShowVotersForm(false)}
                >
                  <FaArrowLeftLong /> Back
                </div>
                <form action="" className=" w-full rounded-md border-base-300 ">
                  <div className="text-center text-base py-4 border-b-2 border-base-300 mb-2">
                    Voters Form
                  </div>
                  <div className="w-full p-6 ">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 border p-4 rounded-md">
                      <div>
                        <label htmlFor="" className="text-xs">
                          Student ID
                        </label>
                        <input
                          type="text"
                          placeholder="ID"
                          className="input input-bordered w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="" className="text-xs">
                          Date
                        </label>
                        <input
                          type="text"
                          placeholder="Date"
                          className="input input-bordered w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="" className="text-xs">
                          Position
                        </label>
                        <input
                          type="text"
                          placeholder="ID"
                          className="input input-bordered w-full"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="" className="text-xs">
                          Department/Course
                        </label>
                        <input
                          type="text"
                          placeholder="ID"
                          className="input input-bordered w-full"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2">
                      <div>
                        <div className="mt-4 text-sm mb-1">President</div>
                        <div className="border p-4 rounded-md  ">
                          <div className="text-xs md:text-sm flex flex-row gap-6">
                            <div className="flex gap-4">
                              <label htmlFor="">John Doe</label>
                              <input
                                type="radio"
                                name="radio-1"
                                className="radio radio-info"
                                defaultChecked
                              />
                            </div>
                            <div className="flex gap-4">
                              <label htmlFor="">Will Sy</label>
                              <input
                                type="radio"
                                name="radio-1"
                                className="radio radio-info"
                                defaultChecked
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="mt-4 text-sm mb-1">Vice President</div>
                        <div className="border p-4 rounded-md  ">
                          <div className="text-xs md:text-sm flex flex-row gap-6">
                            <div className="flex gap-4">
                              <label htmlFor="">John Doe</label>
                              <input
                                type="radio"
                                name="radio-2"
                                className="radio radio-info"
                                defaultChecked
                              />
                            </div>
                            <div className="flex gap-4">
                              <label htmlFor="">Will Sy</label>
                              <input
                                type="radio"
                                name="radio-2"
                                className="radio radio-info"
                                defaultChecked
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-2">
                      <div>
                        <div className="mt-4 text-sm mb-1">Secretary</div>
                        <div className="border p-4 rounded-md  ">
                          <div className="text-xs md:text-sm flex flex-row gap-6">
                            <div className="flex gap-4">
                              <label htmlFor="">Johny Sins</label>
                              <input
                                type="radio"
                                name="radio-1"
                                className="radio radio-info"
                                defaultChecked
                              />
                            </div>
                            <div className="flex gap-4">
                              <label htmlFor="">Dolor Tea</label>
                              <input
                                type="radio"
                                name="radio-1"
                                className="radio radio-info"
                                defaultChecked
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <div className="mt-4 text-sm mb-1">Treasurer</div>
                        <div className="border p-4 rounded-md  ">
                          <div className="text-xs md:text-sm flex flex-row gap-6">
                            <div className="flex gap-4">
                              <label htmlFor="">Samantha Rain sdfsdfsdf</label>
                              <input
                                type="radio"
                                name="radio-2"
                                className="radio radio-info"
                                defaultChecked
                              />
                            </div>
                            <div className="flex gap-4">
                              <label htmlFor="">
                                Lorem Ipsum dolor TEstsff
                              </label>
                              <input
                                type="radio"
                                name="radio-2"
                                className="radio radio-info"
                                defaultChecked
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 justify-center p-6">
                    <button className="btn btn-error">Submit Vote</button>
                    <button className="btn ">Clear Form</button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="w-auto py-2 flex flex-col items-center justify-center  border border-gray-500">
                <div className="text-md font-bold tracking-wider mb-4 ">
                  {roleDisplayName[role]}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {cards.map((card) => (
                    <div
                      key={card.id}
                      className="card bg-base-100 w-72 shadow-sm flex-shrink-0 snap-center transform transition duration-300 ease-in-out hover:scale-105 hover:shadow-xl"
                    >
                      <figure>
                        <img src={card.image} alt={card.title} />
                      </figure>
                      <div className="card-body">
                        <h2 className="card-title">{card.title}</h2>
                        <p>John Doe </p>
                        <p>Information Technology</p>
                        <div className="card-actions justify-end">
                          <button
                            className="btn btn-outline w-full"
                            onClick={() => {
                              setActiveCard(card);
                              setIsOpen(true);
                            }}
                          >
                            Candidate Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex justify-center mt-4 gap-6">
                  <button className="btn btn-outline" onClick={handlePrevious}>
                    Previous
                  </button>
                  <button
                    className="btn btn-outline w-24"
                    // disabled={disableBtn}
                    onClick={handleNext}
                  >
                    Next
                  </button>
                </div>

                {activeCard && (
                  <div
                    className={`fixed inset-0 z-50 flex items-center justify-center bg-black/30  backdrop-blur-sm transition-opacity duration-500 ease-in-out ${
                      isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                    }`}
                  >
                    <div
                      className={`bg-base-100 p-6 rounded-lg shadow-lg w-[90%] max-w-xl transform transition-transform duration-500 ease-in-out ${
                        isOpen ? "scale-100 opacity-100" : "scale-95 opacity-0"
                      }`}
                    >
                      <h2 className="text-xl mb-4 ">{activeCard.title}</h2>

                      <img
                        src={activeCard.image}
                        alt={activeCard.title}
                        className="mb-4 rounded"
                      />
                      <div className="text-xl font-bold ">John Doe</div>
                      <div className="text-xl ">BS Information Technology</div>
                      <p className="mb-4">{activeCard.description}</p>
                      <div className="w-full flex justify-end ">
                        <button
                          className="btn btn-secondary "
                          onClick={() => setIsOpen(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
      <div className="mb-4">
        <Footer />
      </div>
    </div>
  );
}
