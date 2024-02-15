import React, { useState } from 'react';
import axios from 'axios';
import '../../css/Hospital/HospitalChangePassword.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';

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
                navigate('/hospitalChangePassword');
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
        <div>    <Navbar/>
        <div className="hospital-change-password-container">
    
            <div className="hospital-change-password-card">
                <h2 className="hospital-change-password-title">Change Password</h2>
                {errorMessages.general && <p className="error">{errorMessages.general}</p>}
                <form onSubmit={handleSubmit} noValidate className="hospital-change-password-form">
                    <div className="form-group">
                        <label>Old Password:</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="oldPassword"
                                value={passwordData.oldPassword}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                            <button type="button" onClick={togglePasswordVisibility} className="eye-icon">
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        {errorMessages.oldPassword && <p className="error">{errorMessages.oldPassword}</p>}
                    </div>
                    <div className="form-group">
                        <label>New Password:</label>
                        <div className="password-input-container">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                name="newPassword"
                                value={passwordData.newPassword}
                                onChange={handleInputChange}
                                className="form-control"
                                required
                            />
                            <button type="button" onClick={togglePasswordVisibility} className="eye-icon">
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </button>
                        </div>
                        {errorMessages.newPassword && <p className="error">{errorMessages.newPassword}</p>}
                    </div>
                    <div className="form-footer">
                        <button type="submit" className={`btn-primary ${Object.keys(errorMessages).length > 0 ? 'error' : ''}`} disabled={isLoading}>
                            {isLoading ? 'Changing Password...' : 'Change Password'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
        </div>
    );
};

export default HospitalChangePassword;
