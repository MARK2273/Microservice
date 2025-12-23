import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDesc, setNewTaskDesc] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks`, config);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle) return;

    try {
      const res = await axios.post(
        `${API_URL}/api/tasks`,
        {
          title: newTaskTitle,
          description: newTaskDesc,
        },
        config
      );
      setTasks([...tasks, res.data]);
      setNewTaskTitle("");
      setNewTaskDesc("");
    } catch (err) {
      console.error("Failed to create task", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_URL}/api/tasks/${id}`, config);
      setTasks(tasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Failed to delete task", err);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div>
      <nav className="bg-white shadow p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">MicroSaaS Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Welcome, {user.name}</span>
          <button onClick={logout} className="text-red-500 hover:underline">
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto mt-8 p-4">
        <div className="bg-white p-6 rounded shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Create New Task</h2>
          <form
            onSubmit={handleCreateTask}
            className="flex flex-col md:flex-row gap-4"
          >
            <input
              type="text"
              placeholder="Task Title"
              className="border p-2 rounded flex-1"
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
            />
            <input
              type="text"
              placeholder="Description (optional)"
              className="border p-2 rounded flex-1"
              value={newTaskDesc}
              onChange={(e) => setNewTaskDesc(e.target.value)}
            />
            <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Add Task
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">My Tasks</h2>
          {loading ? (
            <p>Loading...</p>
          ) : tasks.length === 0 ? (
            <p className="text-gray-500">No tasks found. Create one above!</p>
          ) : (
            <div className="space-y-4">
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white p-4 rounded shadow border-l-4 border-blue-500 flex justify-between items-center"
                >
                  <div>
                    <h3 className="font-bold">{task.title}</h3>
                    <p className="text-gray-600 text-sm">{task.description}</p>
                    <span className="text-xs bg-gray-200 px-2 py-1 rounded mt-2 inline-block">
                      {task.status}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
