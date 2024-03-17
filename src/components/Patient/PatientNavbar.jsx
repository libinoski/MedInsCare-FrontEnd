import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faNewspaper, faSignOutAlt, faBell } from '@fortawesome/free-solid-svg-icons';

const PatientNavbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
            <div className="container">
                <Link className="navbar-brand fw-bold" to="/" style={{ color: '#000' }}>
                    <FontAwesomeIcon icon={faNewspaper} className="me-2" style={{ color: '#ffc107' }} />
                    MedInsCare
                </Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownProfile" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: '#000' }}>
                                <FontAwesomeIcon icon={faUser} className="me-2" style={{ color: '#007bff' }} />
                                Profile
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownProfile">
                                <li><Link className="dropdown-item" to="/patientChangeProfileImage">Change Profile Image</Link></li>
                                <li><Link className="dropdown-item" to="/patientChangeIdProofImage">Change ID Proof Image</Link></li>
                                <li><hr className="dropdown-divider" /></li>
                                <li><Link className="dropdown-item" to="/patientChangePassword">Change Password</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownNotifications" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: '#000' }}>
                                <FontAwesomeIcon icon={faBell} className="me-2" style={{ color: '#17a2b8' }} />
                                Notifications
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownNotifications">
                                <li><Link className="dropdown-item" to="/patientViewAllNotificationsFromInsuranceProvider">View All Notifications</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownInsurance" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: '#000' }}>
                                Insurance
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownInsurance">
                                <li><Link className="dropdown-item" to="/patientViewAllInsuranceProviders">View All Providers</Link></li>
                                <li><Link className="dropdown-item" to="/patientViewAllInsurancePackages">View All Packages</Link></li>
                                <li><Link className="dropdown-item" to="/patientSearchInsuranceProviders">Search Insurance Providers</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/" aria-label="Logout" style={{ color: '#000' }}>
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
