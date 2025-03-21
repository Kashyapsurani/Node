import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchDashboard = createAsyncThunk(
  "dashboard/fetchDashboard",
  async () => {
    const res = await axios.get("http://localhost:3000/api/dashboard");
    return res.data;
  }
);

const initialState = {
  data: {},
  status: "idle",
  error: null,
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboard.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchDashboard.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});


export default dashboardSlice.reducer;
