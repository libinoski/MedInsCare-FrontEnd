import React from 'react';
import { Link } from 'react-router-dom';
import hospitalImage from '../../images/Hospital/hl.jpg'; 
import insuranceProviderImage from  '../../images/InsuranceProvider/insploginpurp.svg';
import hospitalStaffImage from '../../images/HospitalStaff/groupofstaffs.svg'; 
import patientImage from '../../images/Patient/ptlogin.svg'; 
import Footer from '../Common/Footer';

const HomePage = () => {
    return (
        <div>
            {/* Navbar */}
            <nav className="navbar navbar-dark bg-light">
                <div className="container">
                    <span className="navbar-brand mb-0 h1 text-dark d-block mx-auto font-weight-bold" style={{ fontFamily: 'Arial, sans-serif' }}>MedInsCare Home</span>
                </div>
            </nav>
            {/* End of Navbar */}

            {/* Main container */}
            <div className="container mt-5 mb-5">
                <div className="row justify-content-center">
                    <div className="col-md-12 text-center mb-5">
                        <h2 className="fw-bold">Welcome to MedInsCare</h2>
                        <p className="lead">
                            Your premier solution for modern hospital management. Seamlessly integrating staff coordination, patient care, and insurance provider interactions, MedInsCare is your one-stop platform for optimizing hospital operations.
                        </p>
                        <p className="lead">
                            In today's fast-paced healthcare landscape, efficiency and precision are paramount. That's why MedInsCare offers an intuitive and comprehensive system, empowering hospital administrators to navigate complex tasks with ease. From scheduling staff shifts to coordinating patient appointments and liaising with insurance providers, our cutting-edge tools streamline every facet of hospital administration.
                        </p>
                        <p className="lead">
                            At MedInsCare, we're dedicated to simplifying your workload, allowing you to focus on what truly matters – delivering exceptional care to your patients. Join us in revolutionizing hospital management and embrace a future of efficiency, innovation, and excellence with MedInsCare.
                        </p>
                    </div>
                </div>
                <div className="row justify-content-center">
                    <div className="col-md-3">
                        <Link to="/hospitalLogin" className="text-decoration-none">
                            <div className="card border-black border-2 rounded-3 shadow-lg mb-3" style={{ height: '100%' }}>
                                <img src={hospitalImage} className="card-img-top" alt="Hospital" />
                                <div className="card-body text-center">
                                    <h5 className="card-title">Hospital Login</h5>
                                    <p className="card-text">Are you a hospital administrator?</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-3">
                        <Link to="/insuranceProviderLogin" className="text-decoration-none">
                            <div className="card border-black border-2 rounded-3 shadow-lg mb-3" style={{ height: '100%' }}>
                                <img src={insuranceProviderImage} className="card-img-top" alt="Insurance Provider" />
                                <div className="card-body text-center">
                                    <h5 className="card-title">Insurance Provider Login</h5>
                                    <p className="card-text">Are you an insurance provider?</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-3">
                        <Link to="/hospitalStaffLogin" className="text-decoration-none">
                            <div className="card border-black border-2 rounded-3 shadow-lg mb-3" style={{ height: '100%' }}>
                                <img src={hospitalStaffImage} className="card-img-top" alt="Hospital Staff" />
                                <div className="card-body text-center">
                                    <h5 className="card-title">Hospital Staff Login</h5>
                                    <p className="card-text">Are you a hospital staff member?</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                    <div className="col-md-3">
                        <Link to="/patientLogin" className="text-decoration-none">
                            <div className="card border-black border-2 rounded-3 shadow-lg mb-3" style={{ height: '100%' }}>
                                <img src={patientImage} className="card-img-top" alt="Patient" />
                                <div className="card-body text-center">
                                    <h5 className="card-title">Patient Login</h5>
                                    <p className="card-text">Are you a patient?</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
            {/* End of Main container */}
            
            {/* Footer */}
            <Footer />
            {/* End of Footer */}
        </div>
    );
}

export default HomePage;
