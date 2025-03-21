import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../features/dashboard/dashboardSlice";
import "./Dashbord.css";

const Dashboard = () => {
    const dispatch = useDispatch();
    const { data: dashboard } = useSelector((state) => state.dashboard);

    useEffect(() => {
        dispatch(fetchDashboard());
    }, [dispatch]);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">📊 Dashboard Overview</h1>
            <div className="stats-grid">
                <div className="stat-card fade-in"><h2>Total Students</h2><p>{dashboard.totalStudent ?? 0}</p></div>
                <div className="stat-card fade-in delay-1"><h2>Total Courses</h2><p>{dashboard.totalCourse ?? 0}</p></div>
                <div className="stat-card fade-in delay-2"><h2>Total Revenue</h2><p>${dashboard.totalRevenue?.toLocaleString() ?? 0}</p></div>
            </div>
            <h2 className="section-title">🔥 Popular Courses</h2>
            <ul className="course-list fade-in delay-3">
                {dashboard.popularCourse?.map((course, i) => (
                    <li key={i} className="course-item">
                        <span>{course.title}</span>
                        <span className="enrolled">{course.studentEnrolled} students</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
