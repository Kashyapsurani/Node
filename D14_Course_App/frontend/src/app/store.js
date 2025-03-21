// store.js
import { configureStore } from "@reduxjs/toolkit";
import courseReducer from "../features/course/courseSlice";
import dashboardReducer from "../features/dashboard/dashboardSlice";

const store = configureStore({
  reducer: {
    course: courseReducer,
    dashboard: dashboardReducer,
  },
});

export default store;
