import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getTasksByProject, updateTaskStatus } from "../services/taskService";
import './KanbanPage.css';

function KanbanPage() {
  const { projectId, id } = useParams();
  const projectParam = projectId || id;

  const [tasks, setTasks] = useState([]);
  const [draggedTaskId, setDraggedTaskId] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;
  const canChangeStatus = role === "admin" || role === "membre";

  const fetchTasks = async () => {
    try {
      if (!projectParam) return;
      const data = await getTasksByProject(projectParam);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [projectParam]);

  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "inprogress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      console.error("Error updating task status:", error.message);
    }
  };

  const handleDragStart = (taskId) => {
    if (!canChangeStatus) return;
    setDraggedTaskId(taskId);
  };

  const handleDragOver = (e) => {
    if (!canChangeStatus) return;
    e.preventDefault();
  };

  const handleDrop = async (newStatus) => {
    if (!canChangeStatus) return;
    if (!draggedTaskId) return;

    try {
      await updateTaskStatus(draggedTaskId, newStatus);
      setDraggedTaskId(null);
      fetchTasks();
    } catch (error) {
      console.error("Error dropping task:", error.message);
    }
  };

  const getDeadlineStatus = (deadline) => {
    if (!deadline) return null;

    const today = new Date();
    const dueDate = new Date(deadline);

    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);

    const diffTime = dueDate - today;
    const diffDays = diffTime / (1000 * 60 * 60 * 24);

    if (diffDays < 0) {
      return "overdue";
    }

    if (diffDays <= 2) {
      return "near";
    }

    return "normal";
  };

  const renderDeadlineReminder = (task) => {
    if (task.status === "done") return null;

    const status = getDeadlineStatus(task.deadline);

    if (!status || status === "normal") return null;

    if (status === "overdue") {
      return (
        <p className="kanban-deadline kanban-deadline-overdue">
          Deadline overdue
        </p>
      );
    }

    if (status === "near") {
      return (
        <p className="kanban-deadline kanban-deadline-near">
          Deadline approaching
        </p>
      );
    }

    return null;
  };

  const renderTaskCard = (task) => (
    <div
      key={task._id}
      draggable={canChangeStatus}
      onDragStart={() => handleDragStart(task._id)}
      className="kanban-task-card"
    >
      <div className="kanban-task-top">
        <h4 className="kanban-task-title">{task.title}</h4>
        <span className={`kanban-priority kanban-priority-${task.priority}`}>
          {task.priority}
        </span>
      </div>

      <p className="kanban-task-description">{task.description}</p>

      <div className="kanban-task-meta">
        <p className="kanban-task-info">
          <strong>Priority:</strong> {task.priority}
        </p>

        <p className="kanban-task-info">
          <strong>Deadline:</strong>{" "}
          {task.deadline ? task.deadline.slice(0, 10) : "No deadline"}
        </p>
      </div>

      {renderDeadlineReminder(task)}

      {canChangeStatus ? (
        <select
          className="kanban-status-select"
          value={task.status}
          onChange={(e) => handleStatusChange(task._id, e.target.value)}
        >
          <option value="todo">To do</option>
          <option value="inprogress">In progress</option>
          <option value="done">Done</option>
        </select>
      ) : (
        <input
          className="kanban-status-select"
          type="text"
          value={task.status}
          readOnly
        />
      )}
    </div>
  );

  return (
    <div className="kanban-page">
      <div className="kanban-page-header">
        <h1 className="kanban-page-title">Kanban Board</h1>
        <p className="kanban-page-subtitle">
          Organize your tasks with a clear, modern, and smooth view.
        </p>
      </div>

      <div className="kanban-board">
        <div
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("todo")}
          className="kanban-column"
        >
          <div className="kanban-column-header">
            <h2 className="kanban-column-title">To do</h2>
            <span className="kanban-column-count">{todoTasks.length}</span>
          </div>
          <div className="kanban-column-body">{todoTasks.map(renderTaskCard)}</div>
        </div>

        <div
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("inprogress")}
          className="kanban-column"
        >
          <div className="kanban-column-header">
            <h2 className="kanban-column-title">In progress</h2>
            <span className="kanban-column-count">{inProgressTasks.length}</span>
          </div>
          <div className="kanban-column-body">
            {inProgressTasks.map(renderTaskCard)}
          </div>
        </div>

        <div
          onDragOver={handleDragOver}
          onDrop={() => handleDrop("done")}
          className="kanban-column"
        >
          <div className="kanban-column-header">
            <h2 className="kanban-column-title">Done</h2>
            <span className="kanban-column-count">{doneTasks.length}</span>
          </div>
          <div className="kanban-column-body">{doneTasks.map(renderTaskCard)}</div>
        </div>
      </div>
    </div>
  );
}

export default KanbanPage;