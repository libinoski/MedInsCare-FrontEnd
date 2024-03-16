import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'; // Import Link from react-router-dom

import Footer from '../Common/Footer';
import InsuranceProviderNavbar from './InsuranceProviderNavbar';

const InsuranceProviderViewProfile = () => {
    const navigate = useNavigate();
    const [insuranceProviderProfile, setInsuranceProviderProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const insuranceProviderId = sessionStorage.getItem('insuranceProviderId'); // Change to insuranceProviderId
                const response = await axios.post(
                    'http://localhost:1313/api/mic/insuranceProvider/insuranceProviderViewProfile',
                    { insuranceProviderId }, // Change to insuranceProviderId
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setInsuranceProviderProfile(response.data.data);
                }
            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response;
                    switch (status) {
                        case 401:
                        case 403:
                            alert(data.message || 'Unauthorized access. Please login again.');
                            navigate('/insuranceProviderLogin'); // Assuming you have a route for provider login
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

    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString('en-GB');
        const formattedTime = date.toLocaleTimeString('en-US', { hour12: false });
        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <InsuranceProviderNavbar />

            {/* Main Content */}
            <div className="d-flex flex-grow-1 align-items-center justify-content-center" style={{ padding: '56px 0 80px' }}>
                <div className="card shadow-lg bg-body rounded" style={{ width: '100%', maxWidth: '900px', borderRadius: '15px' }}>
                    {insuranceProviderProfile ? (
                        <div className="card-body">
                            <div className="d-flex justify-content-between">
                                <div className="position-relative d-inline-block">
                                    <img
                                        src={insuranceProviderProfile.insuranceProviderProfileImage}
                                        alt="Profile"
                                        className="img-fluid img-thumbnail rounded-circle"
                                        style={{ width: '200px', height: '200px', objectFit: 'cover', border: '5px solid #f8f9fa' }}
                                    />
                                </div>
                                <div className="flex-grow-1 ms-3">
                                    <h2 className="profile-name mb-4">{insuranceProviderProfile.insuranceProviderName}</h2>
                                    <div className="d-flex flex-column">
                                        <p className="mb-2"><strong>Email:</strong> {insuranceProviderProfile.insuranceProviderEmail}</p>
                                        <p className="mb-2"><strong>Aadhar:</strong> {insuranceProviderProfile.insuranceProviderAadhar}</p>
                                        <p className="mb-2"><strong>Mobile:</strong> {insuranceProviderProfile.insuranceProviderMobile}</p>
                                        <p className="mb-2"><strong>Address:</strong> {insuranceProviderProfile.insuranceProviderAddress}</p>
                                        <p className="mb-2"><strong>Registered Date:</strong> {formatDate(insuranceProviderProfile.registeredDate)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : isLoading ? (
                        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                            <p>No profile found.</p>
                        </div>
                    )}
                    {insuranceProviderProfile && (
                        <div className="card-body d-flex justify-content-center">
                        <Link to="/InsuranceProviderUpdateProfile" style={{ textDecoration: 'none' }}> {/* Inline style to remove underline */}
    <button
        type="submit"
        className="btn btn-outline-secondary text-dark d-flex justify-content-center align-items-center"
        style={{
            border: '2px solid #6c757d',
            color: isLoading ? '#ccc' : '#6c757d',
            backgroundColor: isLoading ? '#f8f9fa' : '',
            pointerEvents: isLoading ? 'none' : 'auto',
            fontWeight: 'bold',
            boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
            padding: '10px 20px',
            borderRadius: '25px',
            width: '100%',
            maxWidth: '200px',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}
        disabled={isLoading}
    >
        {isLoading ? 'Uploading...' : 'Update Details'}
    </button>
</Link>


                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default InsuranceProviderViewProfile;
