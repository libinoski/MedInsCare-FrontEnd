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
            <div className="flex-grow-1 container" style={{ paddingTop: '70px', paddingBottom: '70px', overflowY: 'auto' }}>
                {isLoading ? (
                    <p className="text-center alert alert-info">Loading insurance providers...</p>
                ) : providerList && providerList.length > 0 ? ( // Add check for providerList to ensure it's not undefined
                    <div className="d-flex flex-wrap justify-content-center pt-5 pb-5">
                        {providerList.map((provider, index) => (
                            <div
                                key={index}
                                className="card shadow-sm rounded-3 mb-3 mx-2" style={{ width: '18rem', cursor: 'pointer' }}
                                onClick={() => handleViewProvider(provider.insuranceProviderId)}
                            >
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <div style={{ width: '60px', height: '60px', overflow: 'hidden', borderRadius: '50%', border: '3px solid #007bff' }}>
                                            {provider.insuranceProviderProfileImage && (
                                                <img
                                                    src={provider.insuranceProviderProfileImage}
                                                    className="card-img-top img-fluid rounded-circle"
                                                    alt="Insurance Provider"
                                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h5 className="card-title">{provider.insuranceProviderName}</h5>
                                        </div>
                                    </div>
                                    <p className="card-text text-muted">
                                        <span style={{ fontWeight: 'bold' }}>Registered Date:</span> {new Date(provider.registeredDate).toLocaleDateString()}
                                    </p>
                                    <p className="card-text text-muted">
                                        <span style={{ fontWeight: 'bold' }}>Status:</span> {provider.isActive ? 'Active' : 'Inactive'}
                                    </p>
                                    <p className="card-text text-muted">
                                        <span style={{ fontWeight: 'bold' }}>Email:</span> {provider.insuranceProviderEmail}
                                    </p>
                                    <p className="card-text text-muted">
                                        <span style={{ fontWeight: 'bold' }}>Phone:</span> {provider.insuranceProviderMobile}
                                    </p>
                                    <p className="card-text text-muted">
                                        <span style={{ fontWeight: 'bold' }}>Address:</span> {provider.insuranceProviderAddress}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center alert alert-warning mt-4">No insurance providers found.</div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default HospitalViewAllInsuranceProviders;
