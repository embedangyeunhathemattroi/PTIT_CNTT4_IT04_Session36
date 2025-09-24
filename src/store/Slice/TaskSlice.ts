import { createSlice, createAsyncThunk,  } from "@reduxjs/toolkit";
import axios from "axios";
import type { Task } from "../../util/type";


export const fetchTasks = createAsyncThunk<Task[]>(
  "tasks/fetch",
  async () => {
    const res = await axios.get<Task[]>("http://localhost:8080/tasks");
    return res.data;
  }
);

export const addTask = createAsyncThunk<Task, Omit<Task, "id">>(
  "tasks/add",
  async (task) => {
    const res = await axios.post<Task>("http://localhost:8080/tasks", task);
    return res.data;
  }
);

export const toggleTask = createAsyncThunk<Task, string>(
  "tasks/toggle",
  async (id) => {
    const res = await axios.patch<Task>(
      `http://localhost:8080/tasks/${id}`,
      {}
    );
    return res.data;
  }
);
export const updateTask = createAsyncThunk<Task, { id: string; data: Partial<Task> }>(
  "tasks/update",
  async ({ id, data }) => {
    const res = await axios.patch<Task>(`http://localhost:8080/tasks/${id}`, data);
    return res.data;
  }
);

export const deleteTask = createAsyncThunk<string, string>(
  "tasks/delete",
  async (id) => {
    await axios.delete(`http://localhost:8080/tasks/${id}`);
    return id;
  }
);

interface TaskState {
  items: Task[];
  loading: boolean;
  error: string | null;
}

const initialState: TaskState = {
  items: [],
  loading: false,
  error: null,
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchTasks.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTasks.fulfilled, (state, action) => {
      state.items = action.payload;
      state.loading = false;
    });
    builder.addCase(fetchTasks.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "Lỗi tải dữ liệu";
    });

    // add task
    builder.addCase(addTask.fulfilled, (state, action) => {
      state.items.push(action.payload);
    });

    // toggle task
    builder.addCase(toggleTask.fulfilled, (state, action) => {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    });

    // delete task
    builder.addCase(deleteTask.fulfilled, (state, action) => {
      state.items = state.items.filter((t) => t.id !== action.payload);
    });
    builder.addCase(updateTask.fulfilled, (state, action) => {
      const idx = state.items.findIndex((t) => t.id === action.payload.id);
      if (idx !== -1) state.items[idx] = action.payload;
    });
  },
});

export default taskSlice.reducer;
