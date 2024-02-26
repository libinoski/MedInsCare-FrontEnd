import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../images/Hospital/doc.jpg'; // Import the background image
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const HospitalChangePassword = () => {
    const navigate = useNavigate();
    const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPasswordData({ ...passwordData, [name]: value });
        if (errorMessages[name]) {
            setErrorMessages({ ...errorMessages, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessages({});

        try {
            const hospitalId = sessionStorage.getItem('hospitalId');
            const response = await axios.post('http://localhost:1313/api/mic/hospital/hospitalChangePassword', { ...passwordData, hospitalId }, {
                headers: {
                    'token': sessionStorage.getItem('token'),
                },
            });
            if (response.status === 200) {
                alert(response.data.message);
                navigate('/hospitalLogin');
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        setErrorMessages(data.results || {});
                        break;
                    case 401:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        break; // Do not navigate
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 422:
                        const errorMessage = data.error || "An error occurred during password change.";
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
            <Navbar />
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
                                    {errorMessages.general && <p className="error" style={{ color: 'red' }}>{errorMessages.general}</p>}
                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="mb-3">
                                            <label htmlFor="oldPassword" className="form-label">Old Password:</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="oldPassword"
                                                    value={passwordData.oldPassword}
                                                    onChange={handleInputChange}
                                                    className={`form-control ${errorMessages.oldPassword ? 'error' : ''}`}
                                                    required
                                                    style={{ height: 'calc(2.25rem + 2px)' }}
                                                />
                                                <button type="button" onClick={togglePasswordVisibility} className="btn btn-outline-secondary" style={{ height: 'calc(2.25rem + 2px)' }}>
                                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                </button>
                                            </div>
                                            {errorMessages.oldPassword && <p className="error" style={{ color: 'red' }}>{errorMessages.oldPassword}</p>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="newPassword" className="form-label">New Password:</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPassword ? 'text' : 'password'}
                                                    name="newPassword"
                                                    value={passwordData.newPassword}
                                                    onChange={handleInputChange}
                                                    className={`form-control ${errorMessages.newPassword ? 'error' : ''}`}
                                                    required
                                                    style={{ height: 'calc(2.25rem + 2px)' }}
                                                />
                                                <button type="button" onClick={togglePasswordVisibility} className="btn btn-outline-secondary" style={{ height: 'calc(2.25rem + 2px)' }}>
                                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                </button>
                                            </div>
                                            {errorMessages.newPassword && <p className="error" style={{ color: 'red' }}>{errorMessages.newPassword}</p>}
                                        </div>
                                        <div className="text-center">
                                            <button type="submit" className={`btn btn-primary ${isLoading ? 'disabled' : ''}`} disabled={isLoading}>
                                                {isLoading ? 'Changing Password...' : 'Change Password'}
                                            </button>
                                        </div>
                                    </form>
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

export default HospitalChangePassword;
