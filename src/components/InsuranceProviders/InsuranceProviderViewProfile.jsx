import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
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
        <div>
            <InsuranceProviderNavbar /> {/* Reusing HospitalNavbar temporarily */}
            <div className="container-fluid" style={{ paddingTop: '56px', paddingBottom: '80px' }}>
                <div className="row">
                    <div className="col-lg-6 d-flex align-items-center justify-content-center">
                        {isLoading ? (
                            <div>Loading profile...</div>
                        ) : insuranceProviderProfile ? (
                            <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '600px' }}>
                                <div className="text-center mb-4">
                                    <div className="position-relative d-inline-block">
                                        <img
                                            src={insuranceProviderProfile.insuranceProviderProfileImage}
                                            alt="Profile"
                                            className="img-fluid"
                                            style={{
                                                maxWidth: '300px',
                                                maxHeight: '300px',
                                                objectFit: 'contain',
                                                border: '3px solid white',
                                                boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                                            }}
                                        />
                                        {/* Positioned inside the bottom-right of the image */}
                                        <Link to="/providerChangeImage" className="position-absolute" style={{
                                            bottom: '10px',
                                            right: '10px',
                                            backgroundColor: 'rgba(0, 0, 0, 0.6)',
                                            borderRadius: '50%',
                                            padding: '0.25rem',
                                        }}>
                                            <FontAwesomeIcon
                                                icon={faEdit}
                                                className="text-white"
                                                style={{
                                                    fontSize: '1.25rem',
                                                    boxShadow: '0 2px 4px rgba(0,0,0,0.75)',
                                                }}
                                            />
                                        </Link>
                                    </div>
                                </div>
                                <p className="mb-2"><strong>Name:</strong> {insuranceProviderProfile.insuranceProviderName}</p>
                                <p className="mb-2"><strong>Email:</strong> {insuranceProviderProfile.insuranceProviderEmail}</p>
                                <p className="mb-2"><strong>Aadhar:</strong> {insuranceProviderProfile.insuranceProviderAadhar}</p>
                                <p className="mb-2"><strong>Mobile:</strong> {insuranceProviderProfile.insuranceProviderMobile}</p>
                                <p className="mb-2"><strong>Address:</strong> {insuranceProviderProfile.insuranceProviderAddress}</p>
                                <p className="mb-2"><strong>Registered Date:</strong> {formatDate(insuranceProviderProfile.registeredDate)}</p>
                                <div className="text-center mt-4">
                                    {/* Update details */}
                                    <Link to="/providerUpdateProfile" className="btn btn-primary">Update details</Link>
                                </div>
                            </div>
                        ) : (
                            <div>No profile found.</div>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default InsuranceProviderViewProfile;
