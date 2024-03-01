import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../images/InsuranceProvider/signcntrct.jpg'; // Import the background image
import Footer from '../Common/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const InsuranceProviderLogin = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ insuranceProviderEmail: '', insuranceProviderPassword: '' });
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
            const response = await axios.post('http://localhost:1313/api/mic/insuranceProvider/insuranceProviderLogin', loginData);
            if (response.status === 200) {
                sessionStorage.setItem('insuranceProviderId', response.data.data.insuranceProvider.insuranceProviderId);
                sessionStorage.setItem('token', response.data.data.token);
                navigate('/insuranceProviderDashboard');
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

    return (
<div>
    <div
        className="container-fluid"
        style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            minHeight: '100vh',
            paddingTop: '56px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
    >
        <div
            className="container"
            style={{
                maxWidth: '400px',
                background: 'rgba(255, 255, 255, 0.5)', // Adjusted alpha from 0.8 to 0.75 for more transparency
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                padding: '40px',
                border: '1px solid rgba(0, 0, 0, 0.05)',
            }}
        >
            <div className="text-center mb-4">
                <h2>Login</h2>
            </div>
            <form onSubmit={handleSubmit} noValidate>
                {/* Email Field */}
                <div className="mb-3">
                    <label htmlFor="insuranceProviderEmail" className="form-label">Email:</label>
                    <input
                        type="email" // Make sure to use type="email" for proper validation
                        name="insuranceProviderEmail"
                        value={loginData.insuranceProviderEmail}
                        onChange={handleInputChange}
                        className={`form-control ${errorMessages.insuranceProviderEmail ? 'is-invalid' : ''}`}
                        required
                    />
                    {errorMessages.insuranceProviderEmail && <div className="invalid-feedback">{errorMessages.insuranceProviderEmail}</div>}
                </div>
                
                {/* Password Field */}
                <div className="mb-3">
                    <label htmlFor="insuranceProviderPassword" className="form-label">Password:</label>
                    <div className="input-group">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            name="insuranceProviderPassword"
                            value={loginData.insuranceProviderPassword}
                            onChange={handleInputChange}
                            className={`form-control ${errorMessages.insuranceProviderPassword ? 'is-invalid' : ''}`}
                            required
                        />
                        <button type="button" onClick={togglePasswordVisibility} className="btn btn-outline-secondary">
                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </button>
                        {errorMessages.insuranceProviderPassword && <div className="invalid-feedback" style={{display: 'block'}}>{errorMessages.insuranceProviderPassword}</div>}
                    </div>
                </div>

                <div className="text-center">
                    <button type="submit" className={`btn ${Object.keys(errorMessages).length ? 'btn-danger' : 'btn-primary'} ${isLoading ? 'disabled' : ''}`} disabled={isLoading} style={{ width: '100%' }}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>
            <div className="text-center mt-3">
                <p>Create a new account</p>
                <button
                    className="btn btn-outline-primary"
                    onClick={() => navigate('/insuranceProviderRegistration')}
                    style={{
                        transition: 'all 0.3s ease',
                        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.2)',
                        width: '100%',
                        fontWeight: 'bold',
                    }}
                    onMouseOver={(e) => {
                        e.target.style.transform = 'scale(1.05)';
                        e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.3)';
                    }}
                    onMouseOut={(e) => {
                        e.target.style.transform = 'scale(1)';
                        e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
                    }}
                >
                    Sign up
                </button>
            </div>
        </div>
    </div>
    <Footer />
</div>




    );
};

export default InsuranceProviderLogin;
