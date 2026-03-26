import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addCommentToTask,
  assignTaskToUser,
  createTask,
  deleteTask,
  getTasksByProject,
  updateTask,
  updateTaskStatus,
  uploadTaskFile,
} from "../services/taskService";
import { getProjectById } from "../services/projectService";

function TaskPage() {
  const { id } = useParams();
  const storedUser = localStorage.getItem("user");
  const currentUser = storedUser ? JSON.parse(storedUser) : null;

  const initialFormData = {
    title: "",
    description: "",
    priority: "medium",
    deadline: "",
    projectId: id || "",
    assignedTo: "",
    createdBy: currentUser?._id || "",
  };

  const [tasks, setTasks] = useState([]);
  const [projectMembers, setProjectMembers] = useState([]);
  const [formData, setFormData] = useState(initialFormData);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [selectedFiles, setSelectedFiles] = useState({});
  const [showForm, setShowForm] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  const canManageTasks = role === "admin";
  const canChangeStatus = role === "admin" || role === "membre";
  const canUploadFiles = role === "admin" || role === "membre";

  const fetchTasks = async () => {
    try {
      if (!id) return;
      const data = await getTasksByProject(id);
      setTasks(data);
    } catch (error) {
      console.error("Error fetching tasks:", error.message);
    }
  };

  const fetchProjectMembers = async () => {
    try {
      if (!id) return;
      const project = await getProjectById(id);
      setProjectMembers(project.members || []);
    } catch (error) {
      console.error("Error fetching project members:", error.message);
    }
  };

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      projectId: id || "",
    }));

    fetchTasks();
    fetchProjectMembers();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority,
        deadline: formData.deadline,
        projectId: id || "",
        assignedTo: formData.assignedTo,
        ...(currentUser?._id ? { createdBy: currentUser._id } : {}),
      };

      if (editingTaskId) {
        await updateTask(editingTaskId, payload);
        setEditingTaskId(null);
      } else {
        await createTask(payload);
      }

      setFormData({
        title: "",
        description: "",
        priority: "medium",
        deadline: "",
        projectId: id || "",
        assignedTo: "",
        createdBy: currentUser?._id || "",
      });

      setShowForm(false);
      fetchTasks();
    } catch (error) {
      console.error("Error saving task:", error.response?.data || error.message);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await deleteTask(taskId);
      fetchTasks();
    } catch (error) {
      console.error("Error deleting task:", error.message);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
      fetchTasks();
    } catch (error) {
      console.error("Error updating status:", error.message);
    }
  };

  const handleAssignChange = async (taskId, newAssignedTo) => {
    try {
      await assignTaskToUser(taskId, newAssignedTo);
      fetchTasks();
    } catch (error) {
      console.error("Error assigning task:", error.message);
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task._id);
    setShowForm(true);
    setFormData({
      title: task.title || "",
      description: task.description || "",
      priority: task.priority || "medium",
      deadline: task.deadline ? task.deadline.slice(0, 10) : "",
      projectId: task.projectId || id || "",
      assignedTo: task.assignedTo || "",
      createdBy: task.createdBy || currentUser?._id || "",
    });
  };

  const handleCancelEdit = () => {
    setEditingTaskId(null);
    setShowForm(false);
    setFormData({
      ...initialFormData,
      projectId: id || "",
    });
  };

  const handleCommentInputChange = (taskId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [taskId]: value,
    }));
  };

  const handleAddComment = async (taskId) => {
    try {
      const text = commentInputs[taskId];

      if (!text || !text.trim()) return;
      if (!currentUser?._id) return;

      await addCommentToTask(taskId, {
        text,
        author: currentUser._id,
        authorName: currentUser.username,
      });

      setCommentInputs((prev) => ({
        ...prev,
        [taskId]: "",
      }));

      fetchTasks();
    } catch (error) {
      console.error("Error adding comment:", error.message);
    }
  };

  const handleFileChange = (taskId, file) => {
    setSelectedFiles((prev) => ({
      ...prev,
      [taskId]: file,
    }));
  };

  const handleFileUpload = async (taskId) => {
    try {
      const file = selectedFiles[taskId];

      if (!file) return;

      await uploadTaskFile(taskId, file);

      setSelectedFiles((prev) => ({
        ...prev,
        [taskId]: null,
      }));

      fetchTasks();
    } catch (error) {
      console.error("Error uploading file:", error.message);
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

    if (diffDays < 0) return "overdue";
    if (diffDays <= 2) return "near";

    return "normal";
  };

  const renderDeadlineReminder = (task) => {
    if (task.status === "done") return null;

    const status = getDeadlineStatus(task.deadline);

    if (!status || status === "normal") return null;

    if (status === "overdue") {
      return (
        <p className="task-deadline-alert task-deadline-alert-overdue">
          Deadline dépassée
        </p>
      );
    }

    if (status === "near") {
      return (
        <p className="task-deadline-alert task-deadline-alert-near">
          Deadline proche
        </p>
      );
    }

    return null;
  };

  return (
    <div className="task-page">
      <div className="task-page-header">
        <h1 className="task-page-title">Task Management</h1>
        <p className="task-page-subtitle">
          Suivez vos tâches dans une interface claire et moderne.
        </p>
      </div>

      <div className="task-list-header">
        <h2 className="task-section-title">Task List</h2>
        <div className="task-form-actions">
          <span className="task-list-badge">{tasks.length} tasks</span>

          {canManageTasks && (
            <button
              className="task-btn task-btn-primary"
              type="button"
              onClick={() => {
                if (showForm && !editingTaskId) {
                  setShowForm(false);
                } else {
                  setEditingTaskId(null);
                  setFormData({
                    ...initialFormData,
                    projectId: id || "",
                  });
                  setShowForm(true);
                }
              }}
            >
              {showForm && !editingTaskId ? "Close Form" : "Add Task"}
            </button>
          )}
        </div>
      </div>

      {canManageTasks && showForm && (
        <form onSubmit={handleSubmit} className="task-form-card">
          <div className="task-form-header">
            <h2 className="task-section-title">
              {editingTaskId ? "Update Task" : "Create a New Task"}
            </h2>
          </div>

          <div className="task-form-grid">
            <div className="task-form-group task-form-group-full">
              <label className="task-label">Title</label>
              <input
                className="task-input"
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="task-form-group task-form-group-full">
              <label className="task-label">Description</label>
              <textarea
                className="task-textarea"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="task-form-group">
              <label className="task-label">Priority</label>
              <select
                className="task-select"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div className="task-form-group">
              <label className="task-label">Deadline</label>
              <input
                className="task-input"
                type="date"
                name="deadline"
                value={formData.deadline}
                onChange={handleChange}
              />
            </div>

            <div className="task-form-group task-form-group-full">
              <label className="task-label">Assign To</label>
              <select
                className="task-select"
                name="assignedTo"
                value={formData.assignedTo}
                onChange={handleChange}
              >
                <option value="">Select user</option>
                {projectMembers.map((member, index) => (
                  <option key={index} value={member}>
                    {member}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="task-form-actions">
            <button className="task-btn task-btn-primary" type="submit">
              {editingTaskId ? "Update Task" : "Create Task"}
            </button>

            <button
              className="task-btn task-btn-secondary"
              type="button"
              onClick={handleCancelEdit}
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {tasks.length === 0 ? (
        <div className="task-empty-state">
          <p className="task-empty-text">No tasks found</p>
        </div>
      ) : (
        <div className="task-list">
          {tasks.map((task) => (
            <div key={task._id} className="task-card">
              <div className="task-card-top">
                <div>
                  <h3 className="task-card-title">{task.title}</h3>
                  <p className="task-card-description">{task.description}</p>
                </div>

                <span className={`task-priority-badge task-priority-${task.priority}`}>
                  {task.priority}
                </span>
              </div>

              <div className="task-meta-grid">
                <p className="task-meta-item">
                  <strong>Priority:</strong> {task.priority}
                </p>

                <p className="task-meta-item">
                  <strong>Status:</strong> {task.status}
                </p>

                <p className="task-meta-item">
                  <strong>Deadline:</strong>{" "}
                  {task.deadline ? task.deadline.slice(0, 10) : "No deadline"}
                </p>

                <p className="task-meta-item">
                  <strong>Assigned To:</strong> {task.assignedTo || "Not assigned"}
                </p>
              </div>

              {renderDeadlineReminder(task)}

              <div className="task-controls-grid">
                <div className="task-control-box">
                  <label className="task-label">
                    {canChangeStatus ? "Change Status" : "Status"}
                  </label>

                  {canChangeStatus ? (
                    <select
                      className="task-select"
                      value={task.status}
                      onChange={(e) => handleStatusChange(task._id, e.target.value)}
                    >
                      <option value="todo">To do</option>
                      <option value="inprogress">In progress</option>
                      <option value="done">Done</option>
                    </select>
                  ) : (
                    <input
                      className="task-input"
                      type="text"
                      value={task.status}
                      readOnly
                    />
                  )}
                </div>

                <div className="task-control-box">
                  <label className="task-label">
                    {canManageTasks ? "Assign To" : "Assigned To"}
                  </label>

                  {canManageTasks ? (
                    <select
                      className="task-select"
                      value={task.assignedTo || ""}
                      onChange={(e) => handleAssignChange(task._id, e.target.value)}
                    >
                      <option value="">Select user</option>
                      {projectMembers.map((member, index) => (
                        <option key={index} value={member}>
                          {member}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      className="task-input"
                      type="text"
                      value={task.assignedTo || "Not assigned"}
                      readOnly
                    />
                  )}
                </div>
              </div>

              {canManageTasks && (
                <div className="task-card-actions">
                  <button
                    className="task-btn task-btn-primary"
                    onClick={() => handleEdit(task)}
                  >
                    Edit
                  </button>

                  <button
                    className="task-btn task-btn-danger"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>
                </div>
              )}

              <div className="task-subsection">
                <h4 className="task-subsection-title">Comments</h4>

                {task.comments && task.comments.length > 0 ? (
                  <div className="task-comments-list">
                    {task.comments.map((comment) => (
                      <div key={comment._id} className="task-comment-card">
                        <p className="task-comment-text">{comment.text}</p>
                        <small className="task-comment-author">
                          Author: {comment.authorName || comment.author}
                        </small>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="task-empty-small">No comments yet</p>
                )}

                <div className="task-inline-form">
                  <input
                    className="task-input"
                    type="text"
                    placeholder="Add a comment"
                    value={commentInputs[task._id] || ""}
                    onChange={(e) =>
                      handleCommentInputChange(task._id, e.target.value)
                    }
                  />
                  <button
                    className="task-btn task-btn-secondary"
                    onClick={() => handleAddComment(task._id)}
                  >
                    Add Comment
                  </button>
                </div>
              </div>

              <div className="task-subsection">
                <h4 className="task-subsection-title">Attachments</h4>

                {task.attachments && task.attachments.length > 0 ? (
                  <div className="task-attachments-list">
                    {task.attachments.map((file) => (
                      <div key={file._id} className="task-attachment-item">
                        <a
                          className="task-attachment-link"
                          href={`http://localhost:5002/${file.path.replace(/\\/g, "/")}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {file.filename}
                        </a>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="task-empty-small">No attachments</p>
                )}

                {canUploadFiles && (
                  <div className="task-inline-form task-inline-form-file">
                    <input
                      className="task-file-input"
                      type="file"
                      onChange={(e) => handleFileChange(task._id, e.target.files[0])}
                    />
                    <button
                      className="task-btn task-btn-secondary"
                      onClick={() => handleFileUpload(task._id)}
                    >
                      Upload File
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskPage;