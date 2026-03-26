import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getStatusStats,
  getPriorityStats,
  getProgress,
  getUserStats,
} from "../services/reportService";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

function ReportsPage() {
  const { projectId, id } = useParams();
  const projectParam = projectId || id;

  const [statusStats, setStatusStats] = useState([]);
  const [priorityStats, setPriorityStats] = useState([]);
  const [userStats, setUserStats] = useState([]);
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    loadData();
  }, [projectParam]);

  const loadData = async () => {
    try {
      if (!projectParam) return;

      const status = await getStatusStats(projectParam);
      const priority = await getPriorityStats(projectParam);
      const users = await getUserStats(projectParam);
      const prog = await getProgress(projectParam);

      setStatusStats(status);
      setPriorityStats(priority);
      setUserStats(users);
      setProgress(prog);
    } catch (error) {
      console.error("Error loading reports:", error.message);
    }
  };

  const getStatusColor = (status) => {
    if (status === "todo") return "#9CA3AF";
    if (status === "inprogress") return "#F59E0B";
    if (status === "done") return "#10B981";
    return "#6B7280";
  };

  const getPriorityColor = (priority) => {
    if (priority === "low") return "#22C55E";
    if (priority === "medium") return "#F59E0B";
    if (priority === "high") return "#EF4444";
    return "#6B7280";
  };

  const statusChart = {
    labels: statusStats.map((s) => s._id),
    datasets: [
      {
        label: "Tasks by Status",
        data: statusStats.map((s) => s.count),
        backgroundColor: statusStats.map((s) => getStatusColor(s._id)),
        borderColor: statusStats.map((s) => getStatusColor(s._id)),
        borderWidth: 1,
      },
    ],
  };

  const priorityChart = {
    labels: priorityStats.map((p) => p._id),
    datasets: [
      {
        label: "Tasks by Priority",
        data: priorityStats.map((p) => p.count),
        backgroundColor: priorityStats.map((p) => getPriorityColor(p._id)),
        borderColor: priorityStats.map((p) => getPriorityColor(p._id)),
        borderWidth: 1,
      },
    ],
  };

  const userChart = {
    labels: userStats.map((u) => u._id || "Unassigned"),
    datasets: [
      {
        label: "Tasks by User",
        data: userStats.map((u) => u.count),
        backgroundColor: [
          "#3B82F6",
          "#8B5CF6",
          "#14B8A6",
          "#F97316",
          "#EC4899",
          "#84CC16",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1 className="reports-title">Project Reports</h1>
        <p className="reports-subtitle">
          Analyse claire de l’avancement du projet, des priorités et de la charge de travail.
        </p>
      </div>

      {progress && (
        <div className="reports-progress-card">
          <div className="reports-card-header">
            <h3 className="reports-card-title">Project Progress</h3>
            <span className="reports-progress-badge">{progress.progress}%</span>
          </div>

          <p className="reports-progress-text">
            {progress.doneTasks} / {progress.totalTasks} tasks done
          </p>

          <div className="reports-progress-track">
            <div
              className="reports-progress-fill"
              style={{ width: `${progress.progress}%` }}
            />
          </div>

          <p className="reports-progress-completed">
            {progress.progress}% completed
          </p>
        </div>
      )}

      <div className="reports-grid">
        <div className="reports-chart-card">
          <div className="reports-card-header">
            <h3 className="reports-card-title">Tasks by Status</h3>
          </div>
          <div className="reports-chart-wrapper">
            <Pie data={statusChart} />
          </div>
        </div>

        <div className="reports-chart-card">
          <div className="reports-card-header">
            <h3 className="reports-card-title">Tasks by Priority</h3>
          </div>
          <div className="reports-chart-wrapper">
            <Bar data={priorityChart} />
          </div>
        </div>

        <div className="reports-chart-card">
          <div className="reports-card-header">
            <h3 className="reports-card-title">Tasks by User</h3>
          </div>
          <div className="reports-chart-wrapper">
            <Bar data={userChart} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReportsPage;