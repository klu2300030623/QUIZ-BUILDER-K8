import { Link, useNavigate } from "react-router-dom";
import "./navbar.css";

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("authToken"); // if you store token
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <span className="logo">QuizBuilder</span>
        {!user && <span className="welcome-text">Welcome! Please Login or Register</span>}
      </div>

      <ul className="nav-links">
        {!user && (
          <>
            <li><Link to="/login" className="nav-button">Login</Link></li>
            <li><Link to="/register" className="nav-button">Register</Link></li>
          </>
        )}

        {user && (
          <>
            <li className="welcome-text">Welcome, {user.name}</li>

            {user.role === "ADMIN" && (
              <li><Link to="/admin/dashboard" className="nav-button">Admin Dashboard</Link></li>
            )}
            {user.role === "TEACHER" && (
              <li><Link to="/teacher/dashboard" className="nav-button">Teacher Dashboard</Link></li>
            )}
            {user.role === "STUDENT" && (
              <li><Link to="/student/dashboard" className="nav-button">Student Dashboard</Link></li>
            )}

            <li>
              <button onClick={handleLogout} className="nav-button logout-button">
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

export default Navbar;
