import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./Booking.css";

function Booking() {
    const { movieId } = useParams();
    const [showtime, setShowtime] = useState("");
    const [seats, setSeats] = useState([]);
    const [user, setUser] = useState("");
    const [bookedSeats, setBookedSeats] = useState([]);
    const [showtimes] = useState(["10:00 AM", "1:00 PM", "4:00 PM", "7:00 PM", "10:00 PM"]);

    // ✅ Fetch booked seats when movieId or showtime changes
    useEffect(() => {
        if (movieId && showtime) {
            fetch(`http://localhost:3000/api/bookings/${movieId}/${encodeURIComponent(showtime)}`)
                .then(res => res.json())
                .then(data => setBookedSeats(data || []))
                .catch(err => {
                    console.error("Error fetching booked seats:", err);
                    setBookedSeats([]);
                });
        }
    }, [movieId, showtime]);

    // ✅ Handle Seat Selection
    const handleSeatSelection = (seat) => {
        if (bookedSeats.includes(seat)) {
            alert(`⚠️ Seat ${seat} is already booked!`);
            return;
        }
        setSeats(prev => prev.includes(seat) ? prev.filter(s => s !== seat) : [...prev, seat]);
    };

    // ✅ Handle Booking Submission
    const handleSubmit = () => {
        if (!user.trim()) {
            alert("⚠️ Please enter your name.");
            return;
        }
        if (!showtime) {
            alert("⚠️ Please select a showtime.");
            return;
        }
        if (seats.length === 0) {
            alert("⚠️ Please select at least one seat.");
            return;
        }

        fetch("http://localhost:3000/api/bookings", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ movieId, showtime, seats, user })
        })
            .then(res => res.json())
            .then(data => {
                alert("🎉 Booking successful!");
                setSeats([]);
                setUser("");
                setBookedSeats(data.bookedSeats);
            })
            .catch(err => {
                alert(err.message || "Booking failed");
            });
    };

    return (
        <div className="booking-container">
            <h1>Book Your Tickets 🎟️</h1>

            <label>Showtime:</label>
            <select value={showtime} onChange={(e) => setShowtime(e.target.value)}>
                <option value="">Select a time</option>
                {showtimes.map((time) => (
                    <option key={time} value={time}>{time}</option>
                ))}
            </select>

            <label>Your Name:</label>
            <input type="text" value={user} onChange={(e) => setUser(e.target.value)} />

            <h3>Select Seats:</h3>
            <div className="seating">
                {["A1", "A2", "A3", "B1", "B2", "B3", "C1", "C2", "C3"].map((seat) => (
                    <button
                        key={seat}
                        className={`seat ${bookedSeats?.includes(seat) ? "booked" : seats.includes(seat) ? "selected" : ""}`}
                        onClick={() => handleSeatSelection(seat)}
                        disabled={bookedSeats?.includes(seat)}
                    >
                        {seat}
                    </button>
                ))}
            </div>

            <button className="book-btn" onClick={handleSubmit} disabled={!showtime || !user || seats.length === 0}>
                Book Now
            </button>
        </div>
    );
}
export default Booking;