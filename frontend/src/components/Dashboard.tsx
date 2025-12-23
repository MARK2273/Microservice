import React, { useEffect, useState } from "react";
import axios from "axios";
import { Plus, Trash2, CheckCircle2, Search } from "lucide-react";
import { cn } from "../lib/utils";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED";
}

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  // New Task State
  const [isCreating, setIsCreating] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  const token = localStorage.getItem("token");
  const config = { headers: { Authorization: `Bearer ${token}` } };

  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks`, config);
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) return;
    try {
      const res = await axios.post(
        `${API_URL}/api/tasks`,
        { title, description: desc },
        config
      );
      setTasks([...tasks, res.data]);
      setTitle("");
      setDesc("");
      setIsCreating(false);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    try {
      // Optimistic update
      setTasks(
        tasks.map((t) => (t.id === task.id ? { ...t, status: newStatus } : t))
      );
      await axios.put(
        `${API_URL}/api/tasks/${task.id}`,
        { status: newStatus },
        config
      );
    } catch (err) {
      fetchTasks(); // Revert on error
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      setTasks(tasks.filter((t) => t.id !== id));
      await axios.delete(`${API_URL}/api/tasks/${id}`, config);
    } catch (err) {
      fetchTasks();
    }
  };

  const filteredTasks = tasks.filter(
    (t) =>
      t.title.toLowerCase().includes(filter.toLowerCase()) ||
      t.description.toLowerCase().includes(filter.toLowerCase())
  );

  const stats = {
    total: tasks.length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
    pending: tasks.filter((t) => t.status !== "COMPLETED").length,
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg shadow-blue-200">
          <p className="text-blue-100">Total Tasks</p>
          <h3 className="text-4xl font-bold mt-2">{stats.total}</h3>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <p className="text-slate-500">Pending</p>
          <h3 className="text-4xl font-bold mt-2 text-orange-500">
            {stats.pending}
          </h3>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
          <p className="text-slate-500">Completed</p>
          <h3 className="text-4xl font-bold mt-2 text-green-500">
            {stats.completed}
          </h3>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between gap-4 items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div className="relative w-full md:w-96">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search tasks..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsCreating(!isCreating)}
          className="bg-slate-900 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-slate-800 transition-colors w-full md:w-auto justify-center"
        >
          <Plus size={20} />
          <span>New Task</span>
        </button>
      </div>

      {/* Create Form */}
      {isCreating && (
        <form
          onSubmit={handleCreate}
          className="bg-slate-50 p-6 rounded-2xl border border-slate-200 animate-in fade-in slide-in-from-top-4"
        >
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Task Title"
              className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <textarea
              placeholder="Description (optional)"
              className="px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none min-h-[100px]"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                className="px-6 py-2 text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
              >
                Create Task
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center p-12 text-slate-400">
            Loading your tasks...
          </div>
        ) : filteredTasks.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-2xl border border-dashed border-slate-300">
            <p className="text-slate-500">
              No tasks found. Create one to get started!
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className={cn(
                "group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex items-center gap-4",
                task.status === "COMPLETED" && "opacity-75 bg-slate-50"
              )}
            >
              <button
                onClick={() => toggleStatus(task)}
                className={cn(
                  "h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                  task.status === "COMPLETED"
                    ? "bg-green-500 border-green-500 text-white"
                    : "border-slate-300 text-transparent hover:border-blue-500"
                )}
              >
                <CheckCircle2 size={16} />
              </button>

              <div className="flex-1">
                <h3
                  className={cn(
                    "font-semibold text-lg text-slate-800",
                    task.status === "COMPLETED" && "line-through text-slate-500"
                  )}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="text-slate-500 mt-1">{task.description}</p>
                )}
              </div>

              <button
                onClick={() => handleDelete(task.id)}
                className="text-slate-300 group-hover:text-red-400 hover:bg-red-50 p-2 rounded-lg transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
