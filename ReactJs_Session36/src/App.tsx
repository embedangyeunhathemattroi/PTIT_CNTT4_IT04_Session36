import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTasks,
  addTask,
  toggleTask,
  deleteTask,
  updateTask,
} from "./store/Slice/TaskSlice";
import FilterControls from "./components/FilterControls";
import TaskForm from "./components/TaskForm";
import CircularProgress from "@mui/material/CircularProgress";
import type { Task } from "./util/type";
import TaskItem from "./components/TaskItem";

export default function App() {
  const dispatch = useDispatch();
  const { items: tasks, loading } = useSelector((state) => state.tasks);

  const [filters, setFilters] = useState({
    status: "all",
    priority: "all",
    search: "",
  });

  const [editingTask, setEditingTask] = useState<{
    id: string;
    title: string;
    priority: "low" | "medium" | "high";
  } | null>(null);

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  const handleAdd = (title: string, priority: "low" | "medium" | "high") => {
    dispatch(addTask({ title, priority, completed: false }));
  };

  const handleUpdate = (
    id: string,
    title: string,
    priority: "low" | "medium" | "high"
  ) => {
    dispatch(updateTask({ id, data: { title, priority } }));
    setEditingTask(null);
  };

  const handleToggle = (id: string) => {
    dispatch(toggleTask(id));
  };

  const handleDelete = (id: string) => {
    dispatch(deleteTask(id));
  };

  const filteredTasks = tasks.filter((t) => {
    const matchStatus =
      filters.status === "all" ||
      (filters.status === "completed" && t.completed) ||
      (filters.status === "active" && !t.completed);

    const matchPriority =
      filters.priority === "all" || t.priority === filters.priority;

    const matchSearch = t.title
      .toLowerCase()
      .includes(filters.search.toLowerCase());

    return matchStatus && matchPriority && matchSearch;
  });

  return (
    <div className="max-w-2xl mx-auto p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-center">📝 Task Manager</h1>
      <TaskForm
        onAdd={handleAdd}
        onUpdate={handleUpdate}
        editingTask={editingTask}
        existingTasks={tasks}
      />
      <FilterControls
        status={filters.status}
        priority={filters.priority}
        search={filters.search}
        onStatusChange={(status) => setFilters({ ...filters, status })}
        onPriorityChange={(priority) => setFilters({ ...filters, priority })}
        onSearchChange={(search) => setFilters({ ...filters, search })}
      />

      {loading ? (
        <div className="flex justify-center mt-6">
          <CircularProgress size={40} />
        </div>
      ) : (
        <div>
          {filteredTasks.map((task: Task) => (
            <TaskItem
              key={task.id}
              {...task}
              onToggle={handleToggle}
              onDelete={handleDelete}
              onEdit={(id, title, priority) =>
                setEditingTask({ id, title, priority })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
