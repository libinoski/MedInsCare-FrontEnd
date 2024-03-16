import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

const HospitalViewAllUnapprovedInsuranceProviders = () => {
    const navigate = useNavigate();
    const [unapprovedProviders, setUnapprovedProviders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchUnapprovedProviders = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewAllUnapprovedInsuranceProviders',
                    { hospitalId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setUnapprovedProviders(response.data.data);
                }
            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response;
                    switch (status) {
                        case 401:
                        case 403:
                            alert(data.message || 'Unauthorized access. Please login again.');
                            navigate('/hospitalLogin');
                            break;
                        case 422:
                            alert(data.error || 'Hospital not found.');
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

        fetchUnapprovedProviders();
    }, [navigate]);

    const handleViewDetails = (insuranceProviderId) => {
        sessionStorage.setItem('insuranceProviderId', insuranceProviderId);
        navigate('/hospitalViewOneUnApprovedInsuranceProvider');
    };

    return (
<div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
    <Navbar />
    <div className="flex-grow-1 d-flex align-items-center justify-content-center" style={{ backgroundColor: '#f8f9fa', padding: '70px 0' }}>
        <div className="container">
            {isLoading ? (
                <div className="text-center" style={{ minHeight: '300px' }}>
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : unapprovedProviders.length > 0 ? (
                <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
                    {unapprovedProviders.map((provider, index) => (
                        <div key={index} className="col">
                            <div
                                className="card shadow h-100"
                                style={{ cursor: 'pointer', transition: 'all 0.3s ease', borderRadius: '15px' }}
                                onClick={() => handleViewDetails(provider.insuranceProviderId)}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = 'scale(1.05)'; e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)'; e.currentTarget.style.border = '1px solid blue'; }} // Added blue border on hover
                                onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; e.currentTarget.style.border = 'none'; }} // Revert border on mouse leave
                            >
                                <div className="card-body d-flex flex-column" style={{ maxHeight: '300px', overflow: 'auto' }}>
                                    <img
                                        src={provider.insuranceProviderProfileImage}
                                        className="me-3 rounded-circle mb-3"
                                        alt="Provider Logo"
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            objectFit: 'cover', // Ensure image covers the frame fully
                                            border: '3px solid #ffffff', // Frame color
                                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' // Shadow for depth
                                        }}
                                    />

                                    <div>
                                        <h5 className="card-title text-primary">{provider.insuranceProviderName}</h5>
                                        <p className="card-text"><strong>Email:</strong> {provider.insuranceProviderEmail}</p>
                                        <p className="card-text"><strong>Phone:</strong> {provider.insuranceProviderMobile}</p>
                                        <p className="card-text"><strong>Address:</strong> {provider.insuranceProviderAddress}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center mt-4 alert alert-warning">No unapproved insurance providers available.</div>
            )}
        </div>
    </div>
    <Footer />
</div>


    );
};

export default HospitalViewAllUnapprovedInsuranceProviders;
