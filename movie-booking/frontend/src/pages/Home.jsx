import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
    const [movies, setMovies] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("http://localhost:3000/api/movies")
            .then((res) => setMovies(res.data))
            .catch((err) => console.error("Error fetching movies:", err));
    }, []);

    return (
        <div>
            <h1>Now Showing 🎬</h1>
            <div className="movies-container">
                {movies.map((movie) => (
                    <div key={movie._id} className="movie-card">
                        <img src={movie.poster} alt={movie.title} />
                        <h3>Name:- {movie.title}</h3>
                        <p>Type:- {movie.genre}</p>

                        {/* Book Now Button */}
                        <button
                            className="book-now"
                            onClick={() => navigate(`/booking/${movie._id}`)}
                        >
                            Book Now
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Home;
