import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import TaskPage from "../../frontend/src/pages/TaskPage";
import KanbanPage from "../../frontend/src/pages/KanbanPage";
import ReportsPage from "../../frontend/src/pages/ReportsPage";

function App() {
  return (
    <BrowserRouter>
      <div style={{ padding: "20px" }}>
        <nav style={{ marginBottom: "20px" }}>
          <Link to="/" style={{ marginRight: "15px" }}>
            Tasks
          </Link>

          <Link to="/kanban" style={{ marginRight: "15px" }}>
            Kanban
          </Link>

          <Link to="/reports">
            Reports
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<TaskPage />} />
          <Route path="/kanban" element={<KanbanPage />} />
          <Route path="/reports" element={<ReportsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;