import React, { useState } from 'react';
import axios from 'axios';
import '../../css/Hospital/HospitalLogin.css'; // Import CSS for Hospital Login page
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

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
                alert(response.data.message);
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

    return (
        <div className="hospital-login-container">
            <div className="hospital-login-card">
                <h2 className="hospital-login-title">Welcome to the Portal</h2>
                {errorMessages.general && <p className="error">{errorMessages.general}</p>}
                <form onSubmit={handleSubmit} noValidate className="hospital-login-form">
                    <div className="form-group">
                        <label>Email:</label>
                        <input
                            type="text"
                            name="hospitalEmail"
                            value={loginData.hospitalEmail}
                            onChange={handleInputChange}
                            className={`form-control ${errorMessages.hospitalEmail ? 'error' : ''}`}
                            required
                        />
                        {errorMessages.hospitalEmail && <p className="error">{errorMessages.hospitalEmail}</p>}
                    </div>
                    <div className="form-group">
                        <label>Password:</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="hospitalPassword"
                                value={loginData.hospitalPassword}
                                onChange={handleInputChange}
                                className={`form-control ${errorMessages.hospitalPassword ? 'error' : ''}`}
                                required
                            />
                            <button type="button" onClick={togglePasswordVisibility} className="eye-icon">
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        {errorMessages.hospitalPassword && <p className="error">{errorMessages.hospitalPassword}</p>}
                    </div>
                    <div className="form-footer">
                        <button type="submit" className={`btn-primary ${Object.keys(errorMessages).length > 0 ? 'error' : ''}`} disabled={isLoading}>
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </div>
                </form>
                <p className="create-account-text" onClick={() => navigate('/')}>Create a new account</p>
            </div>
        </div>
    );
};

export default HospitalLogin;
