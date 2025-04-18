import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Register from "./pages/Register.jsx";
import Login from "./pages/Login";
import Blog from "./pages/Blog";
import AddBlog from "./pages/AddBlog";
import Navbar from "./pages/Navbar"; // Adjust path as needed

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/add-blog" element={<AddBlog />} />
      </Routes>
    </Router>
  );
}

export default App;
