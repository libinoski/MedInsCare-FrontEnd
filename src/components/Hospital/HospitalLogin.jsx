import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../images/Hospital/hospital.svg'; // Import the background image
import Footer from '../Common/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const HospitalLogin = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ hospitalEmail: '', hospitalPassword: '' });
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
            const response = await axios.post('http://localhost:1313/api/mic/hospital/hospitalLogin', loginData);
            if (response.status === 200) {
                // alert(response.data.message);
                sessionStorage.setItem('hospitalId', response.data.data.hospital.hospitalId);
                sessionStorage.setItem('token', response.data.data.token);
                navigate('/hospitalViewProfile');
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

    // Define navigateToSignUp function here
    const navigateToSignUp = () => {
        navigate('/hospitalRegistration'); // Change '/signup' to the path you use for your signup page
    };


    const hasErrors = Object.keys(errorMessages).length > 0;


    return (

        <div>
            {/* Navbar */}
            <nav className="navbar navbar-dark" style={{ background: '#f2f2f2' }}>
                <div className="container-fluid">
                    <span className="navbar-brand mb-0 h1 text-dark d-block mx-auto font-weight-bold" style={{ fontFamily: 'Arial, sans-serif' }}>MedInsCare Hospital Login</span>
                </div>
            </nav>

            <div className="container-fluid d-flex flex-column min-vh-100">
                <div className="row flex-grow-1">
                    {/* Background Image Container - Now displayed on medium and larger screens on the left */}
                    <div className="col-md-6 d-none d-md-flex align-items-center justify-content-center p-0 bg-cover bg-center bg-no-repeat" style={{
                        backgroundImage: `url(${backgroundImage})`,
                        minHeight: '100vh',
                        backgroundSize: 'contain',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat'
                    }}>
                    </div>

                    {/* Login Form Card - Now displayed on the right for medium and larger screens */}
                    <div className="col-12 col-md-6 d-flex align-items-center justify-content-center p-0">
                        <div className={`card mx-auto mb-3 shadow ${hasErrors ? 'border border-danger' : ''}`} style={{
                            width: '90%',
                            maxWidth: '400px',
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                            boxShadow: '0 0.5rem 1rem rgba(0, 0, 255, 0.15), 0 0.5rem 1rem rgba(0, 0, 255, 0.3)',
                            marginTop: '20px',
                            borderRadius: '15px'
                        }}>
                            <div className="card-body">
                                {/* Login Form */}
                                <h2 className="card-title text-center">Login</h2>
                                <form onSubmit={handleSubmit} noValidate>
                                    {/* Email Field */}
                                    <div className="mb-3">
                                        <label htmlFor="hospitalEmail" className="form-label">Email:</label>
                                        <input
                                            type="email"
                                            name="hospitalEmail"
                                            value={loginData.hospitalEmail}
                                            onChange={handleInputChange}
                                            className={`form-control ${errorMessages.hospitalEmail ? 'is-invalid' : ''}`}
                                            required
                                        />
                                        {errorMessages.hospitalEmail && <div className="invalid-feedback">{errorMessages.hospitalEmail}</div>}
                                    </div>

                                    {/* Password Field */}
                                    <div className="mb-3">
                                        <label htmlFor="hospitalPassword" className="form-label">Password:</label>
                                        <div className="input-group">
                                            <input
                                                type={showPassword ? 'text' : 'password'}
                                                name="hospitalPassword"
                                                value={loginData.hospitalPassword}
                                                onChange={handleInputChange}
                                                className={`form-control ${errorMessages.hospitalPassword ? 'is-invalid' : ''}`}
                                                required
                                            />
                                            <button type="button" onClick={togglePasswordVisibility} className="btn btn-outline-secondary">
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                            </button>
                                            {errorMessages.hospitalPassword && <div className="invalid-feedback" style={{ display: 'block' }}>{errorMessages.hospitalPassword}</div>}
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <button type="submit" className={`btn btn-primary ${hasErrors ? 'btn-danger' : ''}`} disabled={isLoading} style={{ width: 'auto', background: 'linear-gradient(to right, #32CD32, #008000)', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)', transition: 'all 0.3s ease' }}>
                                            {isLoading ? 'Logging in...' : 'Login'}
                                        </button>
                                    </div>
                                </form>

                                <div className="text-center mt-3">
                                    <p>Don't have an account?</p>
                                    <button onClick={navigateToSignUp} className="btn btn-primary rounded-pill" style={{
                                        width: '100%',
                                        background: 'linear-gradient(to right, #4169E1, #0000FF)',
                                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                                        borderRadius: '8px',
                                        border: 'none',
                                        color: '#fff',
                                        transition: 'all 0.3s ease',
                                        outline: 'none'
                                    }}>
                                        Sign up
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Image Container - Still displayed only on smaller screens */}
                    <div className="col-12 d-md-none p-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: `url(${backgroundImage})`, minHeight: '100vh', backgroundSize: 'cover', backgroundPosition: 'center' }}>
                    </div>
                </div>
            </div>
            {/* Footer component */}
            <footer >
                <Footer />
            </footer>
        </div>

    );
};

export default HospitalLogin;
