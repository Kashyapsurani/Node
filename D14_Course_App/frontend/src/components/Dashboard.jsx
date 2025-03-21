import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Dashbord.css";

const Dashboard = () => {
    const [dashboard, setDashboard] = useState({});

    useEffect(() => {
        axios
            .get("http://localhost:3000/api/dashboard")
            .then((res) => setDashboard(res.data))
            .catch((error) => console.error("Error fetching dashboard:", error));
    }, []);

    return (
        <div className="dashboard-container">
            <h1 className="dashboard-title">📊 Dashboard Overview</h1>

            <div className="stats-grid">
                <div className="stat-card fade-in">
                    <h2>Total Students</h2>
                    <p>{dashboard.totalStudent ?? 0}</p>
                </div>
                <div className="stat-card fade-in delay-1">
                    <h2>Total Courses</h2>
                    <p>{dashboard.totalCourse ?? 0}</p>
                </div>
                <div className="stat-card fade-in delay-2">
                    <h2>Total Revenue</h2>
                    <p>${dashboard.totalRevenue?.toLocaleString() ?? 0}</p>
                </div>
            </div>

            <h2 className="section-title">🔥 Popular Courses</h2>
            <ul className="course-list fade-in delay-3">
                {dashboard.popularCourse?.map((course, index) => (
                    <li key={index} className="course-item">
                        <span>{course.title}</span>
                        <span className="enrolled">{course.studentEnrolled} students</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;
