import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Courses from "./components/CourseList";
import EditCourse from "./components/EditCourse";
import "./App.css"
const App = () => {
  return (
    <Router>
      <div>
        <nav className="navbar">
          <div className="nav-container">
            <ul className="nav-links">
              <li>
                <Link to="/" className="nav-link">Dashboard</Link>
              </li>
              <li>
                <Link to="/courses" className="nav-link">Courses</Link>
              </li>
            </ul>
          </div>
        </nav>
        <div className="content-container p-4">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/edit/:id" element={<EditCourse />} />

          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
