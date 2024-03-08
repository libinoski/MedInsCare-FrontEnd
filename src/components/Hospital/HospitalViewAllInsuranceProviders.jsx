import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

const HospitalViewAllInsuranceProviders = () => {
    const navigate = useNavigate();
    const [providerList, setProviderList] = useState([]); // Ensure this is always an array
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleErrors = (error) => {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 422:
                        const errorMessage422 = data.error || "An error occurred while fetching providers.";
                        alert(errorMessage422);
                        break;
                    case 500:
                        alert(data.error || 'Internal server error. Please try again later.');
                        break;
                    default:
                        alert('An error occurred. Please try again.');
                        break;
                }
            } else {
                alert('An error occurred. Please check your connection and try again.');
            }
        };

        const fetchProviders = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewAllInsuranceProviders',
                    { hospitalId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setProviderList(response.data.data || []); // Ensure response.data.insuranceProviders is always treated as an array
                }
            } catch (error) {
                handleErrors(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchProviders();
    }, [navigate]);

    const handleViewProvider = (insuranceProviderId) => {
        sessionStorage.setItem('insuranceProviderId', insuranceProviderId);
        navigate(`/hospitalViewOneInsuranceProvider`);
    };

    return (
<div className="d-flex flex-column min-vh-100">
    <Navbar />
    <div className="container flex-grow-1 py-5" style={{ overflowY: 'auto' }}>
        {isLoading ? (
            <div className="text-center">
                <div className="spinner-border text-info" role="status">
                    <span className="visually-hidden">Loading insurance providers...</span>
                </div>
            </div>
        ) : providerList && providerList.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-3 g-3 justify-content-center">
                {providerList.map((provider, index) => (
                    <div key={index} className="col">
                        <div className="card shadow-sm h-100" style={{ cursor: 'pointer' }} onClick={() => handleViewProvider(provider.insuranceProviderId)}>
                            <div className="card-body d-flex flex-column align-items-center">
                                <div className="mb-3" style={{ width: '60px', height: '60px', overflow: 'hidden', borderRadius: '50%', border: '3px solid #007bff' }}>
                                    {provider.insuranceProviderProfileImage ? (
                                        <img
                                            src={provider.insuranceProviderProfileImage}
                                            alt="Insurance Provider"
                                            className="img-fluid rounded-circle"
                                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                        />
                                    ) : (
                                        <div className="bg-secondary d-flex justify-content-center align-items-center h-100 w-100 rounded-circle">
                                            <i className="fas fa-building text-white"></i> {/* Placeholder icon if no image */}
                                        </div>
                                    )}
                                </div>
                                <h5 className="card-title text-center">{provider.insuranceProviderName}</h5>
                                <p className="card-text text-muted text-center">
                                    <strong>Registered Date:</strong> {new Date(provider.registeredDate).toLocaleDateString()}
                                </p>
                                <p className="card-text text-muted text-center">
                                    <strong>Status:</strong> {provider.isActive ? 'Active' : 'Inactive'}
                                </p>
                                <p className="card-text text-muted text-center">
                                    <strong>Email:</strong> {provider.insuranceProviderEmail}
                                </p>
                                <p className="card-text text-muted text-center">
                                    <strong>Phone:</strong> {provider.insuranceProviderMobile}
                                </p>
                                <p className="card-text text-muted text-center">
                                    <strong>Address:</strong> {provider.insuranceProviderAddress}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="alert alert-warning text-center" role="alert">
                No insurance providers found.
            </div>
        )}
    </div>
    <Footer />
</div>

    );
};

export default HospitalViewAllInsuranceProviders;
