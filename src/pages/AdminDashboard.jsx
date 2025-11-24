import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line, Bar, Pie } from "react-chartjs-2";
import Footer from "../components/Footer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

const courses = ["CCS", "CTE", "CBA", "PYSCH", "CJE"];
const studentData = [80, 30, 65, 44, 92];
const voterData = [29000, 28000, 22400];
const candidateData = [400, 500, 600, 324, 130];

const lineData = {
  labels: courses,
  datasets: [
    {
      label: "Total Students",
      data: studentData,
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59,130,246,0.2)",
      tension: 0.4,
    },
    // {
    //   label: "Registered Voters",
    //   data: voterData,
    //   borderColor: "#10b981",
    //   backgroundColor: "rgba(16,185,129,0.2)",
    //   tension: 0.4,
    // },
    // {
    //   label: "Candidates",
    //   data: candidateData,
    //   borderColor: "#f59e42",
    //   backgroundColor: "rgba(245,158,66,0.2)",
    //   tension: 0.4,
    // },
  ],
};

const barData = {
  labels: courses,
  datasets: [
    // {
    //   label: "Total Students",
    //   data: studentData,
    //   backgroundColor: "#3b82f6",
    // },
    // {
    //   label: "Registered Voters",
    //   data: voterData,
    //   backgroundColor: "#10b981",
    // },
    {
      label: "Registered Voters",
      data: candidateData,
      backgroundColor: ["#3b82f6", "#f59e42", "#10b981"],
    },
  ],
};

const pieData = {
  labels: courses,
  datasets: [
    {
      label: "Total Students",
      data: studentData,
      backgroundColor: ["#3b82f6", "#f59e42", "#10b981"],
    },
  ],
};

export default function AdminDashboard() {
  return (
    <div className="flex flex-col min-h-screen bg-base-200 overflow-auto">
      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
          Welcome, Admin!
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 ">
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title font-medium">Students</div>
              <div className="stat-value">89,400</div>
              <div className="stat-desc">21% more than last month</div>
            </div>
          </div>
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title font-medium">Registered Voters</div>
              <div className="stat-value">89,400</div>
              <div className="stat-desc">21% more than last month</div>
            </div>
          </div>
          <div className="stats shadow bg-base-100">
            <div className="stat">
              <div className="stat-title font-medium">Admins</div>
              <div className="stat-value">89,400</div>
              <div className="stat-desc">21% more than last month</div>
            </div>
          </div>
        </div>
        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-base-100 rounded-xl shadow p-4">
            <h2 className="font-bold mb-2 text-center">Line Chart</h2>
            <Line data={lineData} />
          </div>
          <div className="bg-base-100 rounded-xl shadow p-4">
            <h2 className="font-bold mb-2 text-center">Bar Chart</h2>
            <Bar data={barData} />
          </div>
          {/* <div className="bg-base-100 rounded-xl shadow p-4">
            <h2 className="font-bold mb-2 text-center">Pie Chart</h2>
            <Pie data={pieData} />
          </div> */}
        </div>
      </main>
      <div className="mb-4">
        <Footer />
      </div>
    </div>
  );
}
