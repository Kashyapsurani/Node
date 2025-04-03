import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import axios from "axios";
import "./Register.css";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const navigate = useNavigate();
    const location = useLocation(); // Get passed state

    // Auto-fill email & password if coming from Register page
    useEffect(() => {
        if (location.state) {
            setEmail(location.state.email || "");
            setPassword(location.state.password || "");
        }
    }, [location.state]);

    const handleLogin = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://localhost:3000/api/auth/login", {
                email,
                password,
            });

            localStorage.setItem("token", response.data.token);
            console.log("Login successful!", response.data);
            navigate("/add-blog"); // Redirect to all blogs page
        } catch (err) {
            console.error("Login error:", err.response ? err.response.data : err.message);
        }
    };




    return (
        <div className="div">
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {message && <p style={{ color: "green" }}>{message}</p>}
            <form onSubmit={handleLogin}>
                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
}

export default Login;
