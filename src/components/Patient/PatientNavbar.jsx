import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faNewspaper, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

const InsuranceProviderNavbar = () => {
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
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownProfile" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <FontAwesomeIcon icon={faUser} className="me-2" style={{ color: '#28a745' }} />
                                Profile Settings
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownProfile">
                                <li><Link className="dropdown-item" to="/patientViewProfile">View Profile</Link></li>
                                <li><Link className="dropdown-item" to="/patientChangePassword">Change Password</Link></li>
                                <li><Link className="dropdown-item" to="/patientViewAllInsuranceProviders">View all insurance providers</Link></li>
                                <li><Link className="dropdown-item" to="/patientViewAllInsurancePackages">View all insurance packages</Link></li>

                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/">
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

export default InsuranceProviderNavbar;
