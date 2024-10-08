import { Link, useNavigate } from "react-router-dom";
import { logout, isAuthenticated } from "../services/api";
import { toast } from "react-toastify";
import "../styles/navbar.css";

import tasksPageIcon from "../assets/icons/tasks-page-icon.png";
import employeesPageIcon from "../assets/icons/employees-page-icon.png";
import statisticsPageIcon from "../assets/icons/statistics-page-icon.png";
import attendancePageIcon from "../assets/icons/attendance-page-icon.png";
import logoutIcon from "../assets/icons/logout-icon.png";

import { useEffect, useState } from "react";

const NavBar = ({ activeNavItem }) => {
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);

    const handleLogoutClick = async () => {
        const response = await logout();
        if (response.error) {
            toast.error(response.error);
        } else {
            toast.success(response.message);
            navigate("/login");
        }
    };

    const checkAuth = async () => {
        const result = await isAuthenticated();
        if (result.user.permissionLevel === "CEO") {
            setIsAuthorized(true);
        }
    };

    useEffect(() => {
        checkAuth();
    }, []);

    return (
        <nav className="navbar-container">
            <div className="navbar-items">
                <Link to="/tasks" className="nav-link">
                    <div
                        className={`nav-item ${
                            activeNavItem === "tasks" ? "nav-item-active" : ""
                        }`}
                    >
                        <img src={tasksPageIcon} alt="Tasks Page" className="nav-icon" />
                    </div>
                </Link>
                
                {isAuthorized && (
                    <>
                        <Link to="/employeesManagement" className="nav-link">
                            <div
                                className={`nav-item ${
                                    activeNavItem === "employeesManagement" ? "nav-item-active" : ""
                                }`}
                            >
                                <img
                                    src={employeesPageIcon}
                                    alt="Employees Management"
                                    className="nav-icon"
                                />
                            </div>
                        </Link>

                        <Link to="/statistics" className="nav-link">
                            <div
                                className={`nav-item ${
                                    activeNavItem === "statistics" ? "nav-item-active" : ""
                                }`}
                            >
                                <img
                                    src={statisticsPageIcon}
                                    alt="Statistics"
                                    className="nav-icon"
                                />
                            </div>
                        </Link>
                    </>
                )}

                <Link to="/attendance" className="nav-link">
                    <div
                        className={`nav-item ${
                            activeNavItem === "attendance" ? "nav-item-active" : ""
                        }`}
                    >
                        <img
                            src={attendancePageIcon}
                            alt="Attendance"
                            className="nav-icon"
                        />
                    </div>
                </Link>
            </div>
            <button className="exit-button" onClick={handleLogoutClick}>
                <img src={logoutIcon} alt="Logout" className="nav-icon" />
            </button>
        </nav>
    );
};

export default NavBar;