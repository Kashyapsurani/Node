import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCourses = createAsyncThunk("courses/fetch", async () => {
  const res = await axios.get("http://localhost:3000/api/course");
  return res.data;
});

export const fetchCourseById = createAsyncThunk(
  "courses/fetchById",
  async (id) => {
    const res = await axios.get(`http://localhost:3000/api/course/${id}`);
    return res.data;
  }
);

export const addCourse = createAsyncThunk("courses/add", async (course) => {
  const res = await axios.post("http://localhost:3000/api/course", course);
  return res.data;
});

export const updateCourse = createAsyncThunk(
  "courses/update",
  async ({ id, updatedData }) => {
    await axios.put(`http://localhost:3000/api/course/${id}`, updatedData);
    return { id, updatedData };
  }
);

export const deleteCourse = createAsyncThunk("courses/delete", async (id) => {
  await axios.delete(`http://localhost:3000/api/course/${id}`);
  return id;
});

const courseSlice = createSlice({
  name: "course",
  initialState: {
    courses: [],
    selectedCourse: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourses.fulfilled, (state, action) => {
        state.courses = action.payload;
        state.status = "succeeded";
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.selectedCourse = action.payload;
      })
      .addCase(addCourse.fulfilled, (state, action) => {
        state.courses.push(action.payload);
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        const { id, updatedData } = action.payload;
        const index = state.courses.findIndex((c) => c._id === id);
        if (index !== -1) state.courses[index] = { _id: id, ...updatedData };
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.courses = state.courses.filter((c) => c._id !== action.payload);
      });
  },
});

export default courseSlice.reducer;
