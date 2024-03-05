import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './InsuranceProviderNavbar';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/InsuranceProvider/ip1.svg'; // Import the background image

const InsuranceProviderUpdateProfile = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        insuranceProviderName: '',
        insuranceProviderMobile: '',
        insuranceProviderAddress: '',
        insuranceProviderAadhar: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false); // New state for confirmation

    useEffect(() => {
        // Fetch profile data on component mount
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const insuranceProviderId = sessionStorage.getItem('insuranceProviderId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/insuranceProvider/insuranceProviderViewProfile',
                    { insuranceProviderId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    const { insuranceProviderName, insuranceProviderMobile, insuranceProviderAddress, insuranceProviderAadhar } = response.data.data;
                    setProfileData({
                        insuranceProviderName,
                        insuranceProviderMobile,
                        insuranceProviderAddress,
                        insuranceProviderAadhar,
                    });
                }
            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response;
                    switch (status) {
                        case 401:
                        case 403:
                            alert(data.message || 'Unauthorized access. Please login again.');
                            navigate('/insuranceProviderLogin');
                            break;
                        case 422:
                            const errorMessage422 = data.error || "An error occurred during profile view.";
                            alert(errorMessage422);
                            break;
                        case 500:
                            alert(data.message || 'Internal server error. Please try again later.');
                            break;
                        default:
                            alert('An error occurred. Please try again.');
                            break;
                    }
                } else {
                    alert('An error occurred. Please check your connection and try again.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, [navigate]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setProfileData({ ...profileData, [name]: value });
        if (errorMessages[name]) {
            setErrorMessages({ ...errorMessages, [name]: '' });
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setErrorMessages({});
        try {
            const token = sessionStorage.getItem('token');
            const insuranceProviderId = sessionStorage.getItem('insuranceProviderId');
            const response = await axios.post('http://localhost:1313/api/mic/insuranceProvider/insuranceProviderUpdateProfile', { ...profileData, insuranceProviderId }, {
                headers: {
                    'token': token,
                },
            });
            if (response.status === 200) {
                alert(response.data.message);
                navigate('/insuranceProviderViewProfile');
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        setErrorMessages(data.results || {});
                        break;
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/insuranceProviderLogin');
                        break;
                    case 422:
                        const errorMessage = data.error || "An error occurred during profile update.";
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
                alert('An error occurred. Please check your connection and try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmation = () => {
        // Check if there are any validation errors
        const hasErrors = Object.keys(errorMessages).length > 0;
        if (!hasErrors) {
            // If no errors, then show confirmation and submit
            setShowConfirmation(true);
        } else {
            // If there are errors, submit without showing confirmation
            handleSubmit();
        }
    };

    const handleConfirmSubmit = () => {
        setShowConfirmation(false);
        handleSubmit();
    };

    return (
        <div>
            <Navbar />
            <div
                className="container-fluid bg-blur"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    paddingTop: '56px',
                    position: 'relative',
                }}
            >
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="mb-3">
                                            <label htmlFor="insuranceProviderName" className="form-label">Name:</label>
                                            <input
                                                type="text"
                                                name="insuranceProviderName"
                                                value={profileData.insuranceProviderName}
                                                onChange={handleInputChange}
                                                className={`form-control ${errorMessages.insuranceProviderName ? 'is-invalid' : ''}`}
                                                id="insuranceProviderName"
                                                required
                                            />
                                            {errorMessages.insuranceProviderName && <div className="invalid-feedback">{errorMessages.insuranceProviderName}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="insuranceProviderMobile" className="form-label">Mobile:</label>
                                            <input
                                                type="text"
                                                name="insuranceProviderMobile"
                                                value={profileData.insuranceProviderMobile}
                                                onChange={handleInputChange}
                                                className={`form-control ${errorMessages.insuranceProviderMobile ? 'is-invalid' : ''}`}
                                                id="insuranceProviderMobile"
                                                required
                                            />
                                            {errorMessages.insuranceProviderMobile && <div className="invalid-feedback">{errorMessages.insuranceProviderMobile}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="insuranceProviderAddress" className="form-label">Address:</label>
                                            <input
                                                type="text"
                                                name="insuranceProviderAddress"
                                                value={profileData.insuranceProviderAddress}
                                                onChange={handleInputChange}
                                                className={`form-control ${errorMessages.insuranceProviderAddress ? 'is-invalid' : ''}`}
                                                id="insuranceProviderAddress"
                                                required
                                            />
                                            {errorMessages.insuranceProviderAddress && <div className="invalid-feedback">{errorMessages.insuranceProviderAddress}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="insuranceProviderAadhar" className="form-label">Aadhar Number:</label>
                                            <input
                                                type="text"
                                                name="insuranceProviderAadhar"
                                                value={profileData.insuranceProviderAadhar}
                                                onChange={handleInputChange}
                                                className={`form-control ${errorMessages.insuranceProviderAadhar ? 'is-invalid' : ''}`}
                                                id="insuranceProviderAadhar"
                                                required
                                            />
                                            {errorMessages.insuranceProviderAadhar && <div className="invalid-feedback">{errorMessages.insuranceProviderAadhar}</div>}
                                        </div>
                                        <div className="text-center">
                                            {showConfirmation ? (
                                                <div>
                                                    <p>Are you sure you want to update the profile?</p>
                                                    <button type="button" className="btn btn-secondary mr-2" onClick={() => setShowConfirmation(false)}>Cancel</button>
                                                    <button type="button" className="btn btn-success" onClick={handleConfirmSubmit}>Confirm</button>
                                                </div>
                                            ) : (
                                                <button type="button" className={`btn btn-${Object.keys(errorMessages).length ? 'danger' : 'success'}`} disabled={isLoading} onClick={handleConfirmation} style={{width: '100px'}}>
                                                    {isLoading ? 'Updating Profile...' : 'Update'}
                                                </button>
                                            )}
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

export default InsuranceProviderUpdateProfile;
