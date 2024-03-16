import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faNewspaper, faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons';

const PatientNavbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/">
                    <FontAwesomeIcon icon={faNewspaper} className="me-2" style={{ color: '#ffc107' }} />
                    MedInsCare
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/patientChangePassword">
                                <FontAwesomeIcon icon={faUser} className="me-2" style={{ color: '#007bff' }} aria-label="User Profile" />
                                Profile
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/patientViewAllNotificationsFromInsuranceProvider">
                                <FontAwesomeIcon icon={faBell} className="me-2" style={{ color: '#6c757d' }} aria-label="Notifications" />
                                Notifications
                            </Link>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownProfile" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Profile
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownProfile">
                                <li><Link className="dropdown-item" to="/patientChangePassword">Change Password</Link></li>
                                <li><Link className="dropdown-item" to="/patientViewAllNotificationsFromInsuranceProvider">View Notifications</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownImages" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                Images
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownImages">
                                <li><Link className="dropdown-item" to="/patientChangeProfileImage">Change Profile Image</Link></li>
                                <li><Link className="dropdown-item" to="/patientChangeIdProofImage">Change ID Proof Image</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/" aria-label="Logout"> {/* Assuming "/logout" is the route for logout */}
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

export default PatientNavbar;
