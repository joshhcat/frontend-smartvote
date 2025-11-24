import React, { useEffect, useState } from "react";
import { FaArrowLeft, FaCheckCircle, FaEye, FaPlus } from "react-icons/fa";
import Footer from "../components/Footer";
import axios from "axios";
import Loader from "../components/Loader";
import { FaCircleXmark, FaPencil, FaTrash } from "react-icons/fa6";

export default function UserManagement() {
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [adminData, setAdminData] = useState({
    admin_id: "",
    password: "test",
    fullname: "",
    email: "",
    departments: [],
    position: "",
    added_by: "",
  });
  const [emptyFields, setEmptyFields] = useState({
    admin_id: false,
    fullname: false,
    email: false,
    departments: false, // Fixed typo
    position: false,
  });

  const [responseMessage, setResponseMessage] = useState({
    message: "",
    type: "",
  });

  // Handle changes for both text inputs and checkboxes
  const handleChanges = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setAdminData((prev) => {
        const updatedDepartments = checked
          ? [...prev.departments, value]
          : prev.departments.filter((dept) => dept !== value);
        return { ...prev, departments: updatedDepartments };
      });
    } else {
      setAdminData((prev) => ({ ...prev, [name]: value }));
    }
  };

  //* Get All Admins
  const [admins, setAdmins] = useState([]);
  const geAllAdmin = async (e) => {
    try {
      const response = await axios.get(
        "http://localhost:3004/smart-vote/get-admins"
      );

      if (response.data.success === true) {
        setAdmins(response.data.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    geAllAdmin();
  }, []);

  //* Create / Update Admin
  const admin_url = selectedAdmin === null ? "create-admin" : "update-admin";
  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    console.log(admin_url);

    const requiredFields = [
      "admin_id",
      "fullname",
      "email",
      "departments",
      "position",
    ];
    let newEmptyFields = { ...emptyFields };
    // Check if any required field is empty and mark it in the state
    requiredFields.forEach((field) => {
      if (field === "departments") {
        // Check if departments is an empty array
        newEmptyFields[field] = adminData[field].length === 0;
      } else {
        // Check for other empty fields
        newEmptyFields[field] = !adminData[field];
      }
    });

    setEmptyFields(newEmptyFields);
    // If any field is empty, prevent submission
    if (requiredFields.some((field) => newEmptyFields[field])) {
      console.log("Please fill in all required fields.");

      setTimeout(() => {
        setEmptyFields({
          admin_id: false,
          fullname: false,
          email: false,
          departments: false, // Fixed typo
          position: false,
        });
      }, 5000);

      return;
    }
    try {
      setIsLoading(true);
      const response = await axios.post(
        `http://localhost:3004/smart-vote/${admin_url}`, // Fix URL
        adminData
      );
      if (response.data.success === true) {
        setTimeout(() => {
          setIsLoading(false);
          setResponseMessage({
            message: response.data.message,
            type: "success",
          });
          setAdminData({
            admin_id: "",
            password: "test",
            fullname: "",
            email: "",
            departments: [],
            position: "",
            added_by: "",
          });
        }, 3000);
        // Set a timeout to remove the responseMessage after 5 seconds
        setTimeout(() => {
          setResponseMessage({ message: "", type: "" }); // Clear message after 5 seconds
          geAllAdmin();
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
      setResponseMessage({
        message: "An error occurred while creating the admin.",
        type: "error",
      });
    }
  };

  //* Delete Admin
  const deleteAdmin = async (e) => {
    e.preventDefault();
    document.getElementById("my_modal_1").close();

    try {
      setIsLoading(true);
      const response = await axios.post(
        `http://localhost:3004/smart-vote/delete-admin/${selectedAdmin.admin_id}`
      );
      if (response.data.success === true) {
        setTimeout(() => {
          setIsLoading(false);
          setResponseMessage({
            message: response.data.message,
            type: "success",
          });
        }, 3000);

        // Set a timeout to remove the responseMessage after 5 seconds
        setTimeout(() => {
          setResponseMessage({ message: "", type: "" }); // Clear message after 5 seconds
          setSelectedAdmin(null);
          geAllAdmin(); // Refresh the list of admins
        }, 5000); // 5000 milliseconds = 5 seconds
      }
    } catch (error) {
      console.error(error);
      setResponseMessage({
        message: "An error deleting while creating the admin.",
        type: "error",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-base-200 overflow-auto">
      {/* Centered Loader with disabled backdrop click */}
      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-75">
          {/* Prevent interaction with content behind */}
          <div className="pointer-events-none">
            <Loader />
          </div>
        </div>
      )}
      <div className="p-8 space-y-6 flex-1">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
          User Management
        </h1>
        {isFormOpen ? (
          <div
            className="btn btn-outline"
            onClick={() => {
              setIsFormOpen(false);
              setSelectedAdmin(null);
              setAdminData({
                admin_id: "",
                password: "test",
                fullname: "",
                email: "",
                departments: [],
                position: "",
                added_by: "",
              });
            }}
          >
            <FaArrowLeft /> Go Back
          </div>
        ) : (
          <div className="btn btn-outline" onClick={() => setIsFormOpen(true)}>
            <FaPlus /> Add Admin
          </div>
        )}
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
        {isFormOpen ? (
          <form action="">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="">Full Name</label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    emptyFields.fullname ? "input-error" : ""
                  }`}
                  name="fullname"
                  value={adminData.fullname || ""}
                  placeholder="Full Name"
                  onChange={handleChanges}
                />
              </div>
              <div>
                <label htmlFor="">Email</label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    emptyFields.email ? "input-error" : ""
                  }`}
                  name="email"
                  value={adminData.email || ""}
                  placeholder="Email"
                  onChange={handleChanges}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label htmlFor="">Admin ID</label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    emptyFields.admin_id ? "input-error" : ""
                  }`}
                  name="admin_id"
                  value={adminData.admin_id}
                  placeholder="Admin ID"
                  onChange={handleChanges}
                />
              </div>

              <div>
                <label htmlFor="">Position</label>
                <input
                  type="text"
                  className={`input input-bordered w-full ${
                    emptyFields.position ? "input-error" : ""
                  }`}
                  name="position"
                  value={adminData.position}
                  placeholder="Position"
                  onChange={handleChanges}
                />
              </div>
            </div>
            <h1 className="mb-2">Select Departments</h1>
            <div
              className={`w-full border p-4 space-y-6 rounded ${
                emptyFields.departments ? "border-error" : ""
              } `}
            >
              <div className="grid grid-cols-3 md:grid-cols-3">
                {["CCS", "CTE", "CBA", "PSYCH", "CJE", "SSG", "BSIT"].map(
                  (dept) => (
                    <div key={dept} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        className="h-4 w-4"
                        name="departments"
                        value={dept}
                        checked={adminData.departments.includes(dept)} // Check if department is selected
                        onChange={handleChanges}
                      />
                      <span className="ml-2">{dept}</span>
                    </div>
                  )
                )}
              </div>
            </div>
            <button
              className="btn btn-secondary w-full md:w-32 mt-4"
              onClick={handleCreateAdmin}
            >
              Submit
            </button>
          </form>
        ) : (
          <>
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="table bg-base-100 rounded-box shadow-md w-full">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Department</th>
                    <th className="px-4 py-2">Position</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {admins.map((admin) => (
                    <tr
                      key={admin.id}
                      className="hover:bg-base-200 cursor-pointer transition"
                    >
                      <td className="flex items-center gap-2 px-4 py-2">
                        {/* <img
                          className="size-10 rounded-box"
                          src={user.img}
                          alt={user.name}
                        /> */}
                        <span>{admin.fullname}</span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-xs uppercase font-semibold">
                          {admin.departments}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className="text-xs uppercase font-semibold">
                          {admin.position}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex gap-2">
                        <button
                          className="btn btn-sm btn-outline "
                          onClick={() => {
                            setIsFormOpen(true);
                            setSelectedAdmin(admin); // Set the selected admin to edit
                            setAdminData({
                              fullname: admin.fullname,
                              email: admin.email,
                              admin_id: admin.admin_id,
                              position: admin.position,
                              departments: admin.departments.split(","),
                            }); // Pre-fill form with selected admin data
                          }}
                        >
                          <span>
                            <FaPencil className="text-green-500" />
                          </span>
                        </button>
                        <button
                          className="btn btn-sm btn-outline "
                          onClick={() => {
                            setSelectedAdmin(admin); // Set the selected admin to edit
                            document.getElementById("my_modal_1").showModal();
                          }}
                        >
                          <span>
                            <FaTrash className="text-red-500" />
                          </span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
        {/* Delete Modal */}
        <dialog id="my_modal_1" className="modal z-30">
          <div className="modal-box">
            <h3 className="font-medium text-md">Confirm Action !</h3>
            <p className="py-4 text-sm text-justify">
              Deleting{" "}
              <span className="text-red-500 font-bold">
                {selectedAdmin?.fullname}
              </span>{" "}
              will be permanent. Do you wish to continue ?
            </p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <div className="flex gap-1">
                  {" "}
                  <button className="btn" onClick={deleteAdmin}>
                    Yes
                  </button>
                  <button className="btn">No</button>
                </div>
              </form>
            </div>
          </div>
        </dialog>
      </div>
      <div className="mb-4">
        <Footer />
      </div>
    </div>
  );
}
