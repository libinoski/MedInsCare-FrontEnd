import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserNurse, faNewspaper, faSignOutAlt, faHospitalUser, faBell } from '@fortawesome/free-solid-svg-icons';

const HospitalStaffNavbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    {/* Apply color to the hospital icon */}
                    <FontAwesomeIcon icon={faHospitalUser} className="me-2" style={{ color: '#007bff' }} />
                    Hospital Staff Management
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownProfile" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {/* Apply color to the user icon */}
                                <FontAwesomeIcon icon={faUser} className="me-2" style={{ color: '#28a745' }} />
                                Profile Settings
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownProfile">
                                <li><Link className="dropdown-item" to="/hospitalStaffViewProfile">View Profile</Link></li>
                                <li><Link className="dropdown-item" to="/hospitalStaffChangePassword">Change Password</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownStaff" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {/* Apply color to the nurse icon */}
                                <FontAwesomeIcon icon={faUserNurse} className="me-2" style={{ color: '#17a2b8' }} />
                                Patient Management
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownStaff">
                                <li><Link className="dropdown-item" to="/hospitalStaffRegisterPatient">Register patient</Link></li>
                                <li><Link className="dropdown-item" to="/hospitalStaffViewAllPatients">View All patients</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownNews" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {/* Apply color to the newspaper icon */}
                                <FontAwesomeIcon icon={faNewspaper} className="me-2" style={{ color: '#ffc107' }} />
                                News Management
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownNews">
                                <li><Link className="dropdown-item" to="/hospitalStaffViewAllNews">View All News</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownNotifications" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                {/* Apply color to the bell icon */}
                                <FontAwesomeIcon icon={faBell} className="me-2" style={{ color: '#ff0000' }} />
                                Notifications
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownNotifications">
                                <li><Link className="dropdown-item" to="/hospitalStaffViewAllNotifications">View All Notifications</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
                                {/* Apply color to the sign-out icon */}
                                <FontAwesomeIcon icon={faSignOutAlt} className="me-2" style={{ color: '#dc3545' }} />
                                Logout
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default HospitalStaffNavbar;
