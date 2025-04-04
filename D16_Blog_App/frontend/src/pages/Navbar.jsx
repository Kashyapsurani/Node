import { Link } from "react-router-dom";

function Navbar() {
    return (
        <nav style={styles.nav}>
            <h2 style={styles.logo}>My Blog</h2>
            <ul style={styles.navList}>
                <li><Link to="/add-blog" style={styles.link}>Add Blog</Link></li>
                <li><Link to="/blog" style={styles.link}>All Blog</Link></li>
                <li><Link to="/login" style={styles.link}>Login</Link></li>
                <li><Link to="/register" style={styles.link}>Register</Link></li>
            </ul>
        </nav>
    );
}

const styles = {
    nav: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "1rem 2rem",
        backgroundColor: "#282c34",
    },
    logo: {
        color: "white",
        margin: 0,
    },
    navList: {
        listStyle: "none",
        display: "flex",
        gap: "1.5rem",
        margin: 0,
        padding: 0,
    },
    link: {
        color: "white",
        textDecoration: "none",
        fontWeight: "bold",
    },
};

export default Navbar;
