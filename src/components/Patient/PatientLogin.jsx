import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../images/Patient/patient.svg'; // Import the background image
import Footer from '../Common/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const PatientLogin = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ patientEmail: '', patientPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setLoginData({ ...loginData, [name]: value });
        if (errorMessages[name]) {
            setErrorMessages({ ...errorMessages, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessages({});

        try {
            const response = await axios.post('http://localhost:1313/api/mic/patient/patientLogin', loginData);
            if (response.status === 200) {
                // alert(response.data.message);
                sessionStorage.setItem('patientId', response.data.data.patient.patientId);
                sessionStorage.setItem('hospitalId', response.data.data.patient.hospitalId);

                sessionStorage.setItem('token', response.data.data.token);
                navigate('/patientViewProfile');
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        setErrorMessages(data.results || {});
                        break;
                    case 422:
                        const errorMessage = data.error || "An error occurred during login.";
                        alert(errorMessage);
                        break;
                    case 500:
                        alert(data.message || 'Internal server error. Please try again later.');
                        break;
                    default:
                        alert('An error occurred. Please try again.');
                        break;
                }
            } else {
                setErrorMessages({ ...errorMessages, general: 'An error occurred. Please check your connection and try again.' });
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const hasErrors = Object.keys(errorMessages).length > 0;



    return (
        <div>
        {/* Navbar */}
        <nav className="navbar navbar-dark" style={{ background: '#f2f2f2' }}>
            <div className="container-fluid">
                <span className="navbar-brand mb-0 h1 text-dark d-block mx-auto font-weight-bold" style={{ fontFamily: 'Arial, sans-serif' }}>MedInsCare Patient Login</span>
            </div>
        </nav>

        <div className="container-fluid d-flex flex-column min-vh-100">
            <div className="row flex-grow-1">
                {/* Background Image Container - Now displayed on medium and larger screens on the left */}
                <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center p-0" style={{
                    minHeight: '100vh',
                    background: `url(${backgroundImage}) no-repeat center center`,
                    backgroundSize: 'contain',
                }}>
                </div>

                {/* Login Form Card - Now displayed on the right for medium and larger screens */}
                <div className="col-12 col-md-6 d-flex align-items-center justify-content-center p-0">
                    <div className={`card mx-auto mb-3 shadow ${hasErrors ? 'border border-danger' : ''}`} style={{
                        width: '90%',
                        maxWidth: '400px',
                        backgroundColor: '#f8f9fa', // Background color
                        borderRadius: '15px', // Rounded corners
                        boxShadow: '0 0.5rem 1rem rgba(0, 0, 0, 0.1)', // Box shadow
                        marginTop: '20px' // Margin at the top
                    }}>
                        <div className="card-body">
                            {/* Login Form */}
                            <h2 className="card-title text-center mb-4">Login</h2>
                            <form onSubmit={handleSubmit} noValidate>
                                {/* Email Field */}
                                <div className="mb-3">
                                    <label htmlFor="patientEmail" className="form-label">Email:</label>
                                    <input
                                        type="email"
                                        name="patientEmail"
                                        value={loginData.patientEmail}
                                        onChange={handleInputChange}
                                        className={`form-control ${errorMessages.patientEmail ? 'is-invalid' : ''}`}
                                        required
                                    />
                                    {errorMessages.patientEmail && <div className="invalid-feedback">{errorMessages.patientEmail}</div>}
                                </div>

                                {/* Password Field */}
                                <div className="mb-3">
                                    <label htmlFor="patientPassword" className="form-label">Password:</label>
                                    <div className="input-group">
                                        <input
                                            type={showPassword ? 'text' : 'password'}
                                            name="patientPassword"
                                            value={loginData.patientPassword}
                                            onChange={handleInputChange}
                                            className={`form-control ${errorMessages.patientPassword ? 'is-invalid' : ''}`}
                                            required
                                        />
                                        <button type="button" onClick={togglePasswordVisibility} className="btn btn-outline-secondary">
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                        {errorMessages.patientPassword && <div className="invalid-feedback" style={{ display: 'block' }}>{errorMessages.patientPassword}</div>}
                                    </div>
                                </div>

                                <div className="text-center">
                                    <button type="submit" className={`btn btn-primary ${hasErrors ? 'btn-danger' : ''}`} disabled={isLoading} style={{ width: 'auto', background: 'linear-gradient(to right, #004d40, #388e3c)', border: 'none', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)', transition: 'all 0.3s ease' }}>
                                        {isLoading ? 'Logging in...' : 'Login'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>

                {/* Background Image Container - Still displayed only on smaller screens */}
                <div className="col-12 d-md-none p-0" style={{ background: `url(${backgroundImage}) no-repeat center center`, minHeight: '100vh', backgroundSize: 'contain' }}>
                </div>
            </div>
        </div>
        {/* Footer component */}
        <footer>
            <Footer />
        </footer>
    </div>




    );
};

export default PatientLogin;
