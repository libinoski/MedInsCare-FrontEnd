import React from 'react';
import { Link } from 'react-router-dom';
import '../../css/Hospital/HospitalNavbar.css';

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container">
                <Link className="navbar-brand" to="/">Hospital Management</Link>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/hospitalViewProfile">View Profile</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/hospitalChangePassword">Change Password</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/hospitalRegisterStaff">Register Staff</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/hospitalViewAllStaffs">View All Staffs</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/hospitalSearchStaffs">Search Staffs</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/hospitalAddNews">Add News</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/hospitalViewAllNews">View All News</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/hospitalLogin">Logout</Link>
                        </li>


                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
