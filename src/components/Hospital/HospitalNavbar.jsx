import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faUserNurse, faNewspaper, faSignOutAlt, faUserInjured } from '@fortawesome/free-solid-svg-icons';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light" style={{ background: '#f8f9fa', borderBottom: '1px solid #e0e0e0' }}>
            <div className="container">
            <Link className="navbar-brand fw-bold d-flex align-items-center" to="/dashboard" style={{ color: '#495057' }}>
                    <span style={{ fontSize: '1.2rem' }}>MedInsCare</span>
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownProfile" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: '#495057' }}>
                                <FontAwesomeIcon icon={faUser} className="me-2" style={{ color: '#28a745' }} />
                                Profile Settings
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownProfile">
                                <li><Link className="dropdown-item" to="/dashboard">Dashboard</Link></li>
                                <li><Link className="dropdown-item" to="/hospitalViewProfile">View Profile</Link></li>
                                <li><Link className="dropdown-item" to="/hospitalChangePassword">Change Password</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownStaff" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: '#495057' }}>
                                <FontAwesomeIcon icon={faUserNurse} className="me-2" style={{ color: '#17a2b8' }} />
                                Staff Management
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownStaff">
                                <li><Link className="dropdown-item" to="/hospitalRegisterStaff">Register Staff</Link></li>
                                <li><Link className="dropdown-item" to="/hospitalViewAllStaffs">View All Staffs</Link></li>
                                <li><Link className="dropdown-item" to="/hospitalViewAllSuspendedStaffs">View All Suspended Staffs</Link></li>
                                <li><Link className="dropdown-item" to="/hospitalSearchStaffs">Search Staffs</Link></li>
                                <li><Link className="dropdown-item" to="/hospitalViewAllPatients">View all patients</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownInsurance" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: '#495057' }}>
                                <FontAwesomeIcon icon={faUserNurse} className="me-2" style={{ color: '#ffc107' }} />
                                Insurance Providers
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownInsurance">
                                <li><Link className="dropdown-item" to="/hospitalViewAllUnApprovedInsuranceProviders">View all unapproved insurance providers</Link></li>
                                <li><Link className="dropdown-item" to="/hospitalViewAllInsuranceProviders">View all insurance providers</Link></li>
                                <li><Link className="dropdown-item" to="/hospitalSearchInsuranceProviders">Search insurance providers</Link></li>
                                <li><Link className="dropdown-item" to="/viewAllReviews">View all reviews</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownNews" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: '#495057' }}>
                                <FontAwesomeIcon icon={faNewspaper} className="me-2" style={{ color: '#ffc107' }} />
                                News Management
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownNews">
                                <li><Link className="dropdown-item" to="/hospitalAddNews">Add News</Link></li>
                                <li><Link className="dropdown-item" to="/hospitalViewAllNews">View All News</Link></li>
                            </ul>
                        </li>
                        <li className="nav-item dropdown">
                            <Link className="nav-link dropdown-toggle" to="#" id="navbarDropdownPatient" role="button" data-bs-toggle="dropdown" aria-expanded="false" style={{ color: '#495057' }}>
                                <FontAwesomeIcon icon={faUserInjured} className="me-2" style={{ color: '#007bff' }} />
                                Patient Management
                            </Link>
                            <ul className="dropdown-menu" aria-labelledby="navbarDropdownPatient">
                                <li><Link className="dropdown-item" to="/hospitalViewAllPatients">View Patients</Link></li>
                                <li><Link className="dropdown-item" to="/hospitalSearchPatients">Search Patients</Link></li>
                                <li><Link className="dropdown-item" to="/HospitalViewAllMedicalRecords">View All Medical Records</Link></li>
                                {/* Add more patient management related links as needed */}
                            </ul>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/hospitalLogin" style={{ color: '#495057' }}>
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

export default Navbar;
