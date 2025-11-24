import { useState } from "react";

const OpenFiling = ({ dept, setElectionOpened, setShowElectionForm }) => {
  const [formData, setFormData] = useState({
    adminId: "",
    adminPassword: "",
    closeElectionDate: "",
    department: dept,
    electionStatus: "open",
  });
  //

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    localStorage.setItem("electionData", JSON.stringify(formData));
    setTimeout(() => {
      setElectionOpened(true);
      setShowElectionForm(false);
    }, 3000);
  };

  return (
    <div className="max-w-md h-96 mx-auto bg-base-100 p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-4">
        Open {dept} Election
      </h2>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="Admin ID"
          name="adminId"
          className="input input-bordered w-full"
          value={formData.adminId}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          placeholder="Admin Password"
          name="adminPassword"
          className="input input-bordered w-full"
          value={formData.adminPassword}
          onChange={handleChange}
          required
        />
        <label className="block font-medium">Election Close Date</label>
        <input
          type="datetime-local"
          className="input input-bordered w-full"
          name="closeElectionDate"
          value={formData.closeElectionDate}
          onChange={handleChange}
          required
        />
        <button
          className="btn bg-gray-800 text-white w-full"
          onClick={handleSubmit}
        >
          Open Election
        </button>
      </form>
    </div>
  );
};

export default OpenFiling;
