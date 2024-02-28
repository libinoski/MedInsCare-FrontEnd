import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../images/Hospital/doc.jpg'; // Import the background image
import Footer from '../Common/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const HospitalStaffLogin = () => {
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({ hospitalStaffEmail: '', hospitalStaffPassword: '' });
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
            const response = await axios.post('http://localhost:1313/api/mic/hospitalStaff/hospitalStaffLogin', loginData);
            if (response.status === 200) {
                alert(response.data.message);
                sessionStorage.setItem('hospitalStaffId', response.data.data.hospitalStaff.hospitalStaffId);
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
        <div>
            <div
                className="container-fluid"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    paddingTop: '56px',
                    position: 'relative',
                }}
            >
                <div
                    className="container"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '100%',
                        padding: '50px 15px 0',
                        overflowY: 'auto',
                        maxHeight: 'calc(100% - 56px)',
                    }}
                >
                    <div className="row justify-content-center">
                        <div className="col-lg-4">
                            <div className="card" style={{ textAlign: 'left', background: 'rgba(255, 255, 255, 0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(0, 0, 0, 0.1)' }}>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="mb-3">
                                            <label htmlFor="hospitalStaffEmail" className="form-label">Email:</label>
                                            <input
                                                type="text"
                                                name="hospitalStaffEmail"
                                                value={loginData.hospitalStaffEmail}
                                                onChange={handleInputChange}
                                                className={`form-control ${errorMessages.hospitalStaffEmail ? 'error' : ''}`}
                                                required
                                                style={{ height: 'calc(2.25rem + 2px)' }}
                                            />
                                            {errorMessages.hospitalStaffEmail && <p className="error" style={{ color: 'red' }}>{errorMessages.hospitalStaffEmail}</p>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="hospitalStaffPassword" className="form-label">Password:</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="hospitalStaffPassword"
                                                    value={loginData.hospitalStaffPassword}
                                                    onChange={handleInputChange}
                                                    className={`form-control ${errorMessages.hospitalStaffPassword ? 'error' : ''}`}
                                                    required
                                                    style={{ height: 'calc(2.25rem + 2px)' }}
                                                />
                                                <button type="button" onClick={togglePasswordVisibility} className="btn btn-outline-secondary" style={{ height: 'calc(2.25rem + 2px)' }}>
                                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                </button>
                                            </div>
                                            {errorMessages.hospitalStaffPassword && <p className="error" style={{ color: 'red' }}>{errorMessages.hospitalStaffPassword}</p>}
                                        </div>
                                        <div className="text-center">
                                            <button type="submit" className={`btn ${Object.keys(errorMessages).length ? 'btn-danger' : 'btn-primary'} ${isLoading ? 'disabled' : ''}`} disabled={isLoading}>
                                                {isLoading ? 'Logging in...' : 'Login'}
                                            </button>
                                        </div>
                                    </form>
                                    <p className="text-center mt-3 mb-0">Create a new account</p>
                                    <p className="text-center mb-0">
                                        <button className="btn btn-link" onClick={() => navigate('/')}>Sign up</button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HospitalStaffLogin;