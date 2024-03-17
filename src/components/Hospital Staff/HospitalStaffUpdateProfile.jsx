import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import HospitalStaffNavbar from './HospitalStaffNavbar';

const HospitalStaffUpdateProfile = () => {
    const navigate = useNavigate();
    const [profileData, setProfileData] = useState({
        hospitalStaffName: '',
        hospitalStaffMobile: '',
        hospitalStaffAddress: '',
        hospitalStaffAadhar: '',
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
                const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospitalStaff/hospitalStaffViewProfile',
                    { hospitalStaffId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    const { hospitalStaffName, hospitalStaffMobile, hospitalStaffAddress, hospitalStaffAadhar } = response.data.data;
                    setProfileData({
                        hospitalStaffName,
                        hospitalStaffMobile,
                        hospitalStaffAddress,
                        hospitalStaffAadhar,
                    });
                }
            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response;
                    switch (status) {
                        case 401:
                        case 403:
                            alert(data.message || 'Unauthorized access. Please login again.');
                            navigate('/hospitalStaffLogin');
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
            const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
            const response = await axios.post('http://localhost:1313/api/mic/hospitalStaff/hospitalStaffUpdateProfile', { ...profileData, hospitalStaffId }, {
                headers: {
                    'token': token,
                },
            });
            if (response.status === 200) {
                alert(response.data.message);
                navigate('/hospitalStaffViewProfile');
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
                        navigate('/hospitalStaffLogin');
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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

    <HospitalStaffNavbar />
    <div className="container" style={{ minHeight: '100vh', paddingTop: '56px', position: 'relative' }}>
        <div className="py-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card" style={{ backgroundColor: '#FFFFFF' }}>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label htmlFor="hospitalStaffName" className="form-label">Name:</label>
                                    <input
                                        type="text"
                                        name="hospitalStaffName"
                                        value={profileData.hospitalStaffName}
                                        onChange={handleInputChange}
                                        className={`form-control ${errorMessages.hospitalStaffName ? 'is-invalid' : ''}`}
                                        id="hospitalStaffName"
                                        required
                                    />
                                    {errorMessages.hospitalStaffName && <div className="invalid-feedback">{errorMessages.hospitalStaffName}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="hospitalStaffMobile" className="form-label">Mobile:</label>
                                    <input
                                        type="text"
                                        name="hospitalStaffMobile"
                                        value={profileData.hospitalStaffMobile}
                                        onChange={handleInputChange}
                                        className={`form-control ${errorMessages.hospitalStaffMobile ? 'is-invalid' : ''}`}
                                        id="hospitalStaffMobile"
                                        required
                                    />
                                    {errorMessages.hospitalStaffMobile && <div className="invalid-feedback">{errorMessages.hospitalStaffMobile}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="hospitalStaffAddress" className="form-label">Address:</label>
                                    <input
                                        type="text"
                                        name="hospitalStaffAddress"
                                        value={profileData.hospitalStaffAddress}
                                        onChange={handleInputChange}
                                        className={`form-control ${errorMessages.hospitalStaffAddress ? 'is-invalid' : ''}`}
                                        id="hospitalStaffAddress"
                                        required
                                    />
                                    {errorMessages.hospitalStaffAddress && <div className="invalid-feedback">{errorMessages.hospitalStaffAddress}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="hospitalStaffAadhar" className="form-label">Aadhar Number:</label>
                                    <input
                                        type="text"
                                        name="hospitalStaffAadhar"
                                        value={profileData.hospitalStaffAadhar}
                                        onChange={handleInputChange}
                                        className={`form-control ${errorMessages.hospitalStaffAadhar ? 'is-invalid' : ''}`}
                                        id="hospitalStaffAadhar"
                                        required
                                    />
                                    {errorMessages.hospitalStaffAadhar && <div className="invalid-feedback">{errorMessages.hospitalStaffAadhar}</div>}
                                </div>
                                <div className="text-center">
                                    {showConfirmation ? (
                                        <div>
                                            <p>Are you sure you want to update the profile?</p>
                                            <button 
                                                type="button" 
                                                className="btn mx-2 btn-outline-secondary text-dark" 
                                                onClick={() => setShowConfirmation(false)}
                                                style={{
                                                    border: '2px solid #6c757d',
                                                    color: '#6c757d',
                                                    fontWeight: 'bold',
                                                    padding: '10px 20px',
                                                    borderRadius: '25px'
                                                }}
                                            >
                                                Cancel
                                            </button>
                                            <button 
                                                type="button" 
                                                className="btn mx-2 btn-outline-secondary text-dark" 
                                                onClick={handleConfirmSubmit}
                                                style={{
                                                    border: '2px solid #6c757d',
                                                    color: '#6c757d',
                                                    fontWeight: 'bold',
                                                    padding: '10px 20px',
                                                    borderRadius: '25px'
                                                }}
                                            >
                                                Confirm
                                            </button>
                                        </div>
                                    ) : (
                                        <button 
                                            type="button" 
                                            className="btn mx-2 btn-outline-secondary text-dark" 
                                            disabled={isLoading} 
                                            onClick={handleConfirmation} 
                                            style={{
                                                border: '2px solid #6c757d',
                                                color: '#6c757d',
                                                fontWeight: 'bold',
                                                padding: '10px 20px',
                                                borderRadius: '25px',
                                                width: 'auto'
                                            }}
                                        >
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

export default HospitalStaffUpdateProfile;
