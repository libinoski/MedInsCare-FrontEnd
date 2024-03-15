import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import PatientNavbar from './PatientNavbar';

const PatientViewAllInsuranceProviders = () => {
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
                        navigate('/patientLogin');
                        break;
                    case 422:
                        const errorMessage422 = data.error || "An error occurred while fetching providers.";
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
        };

        const fetchProviders = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const patientId = sessionStorage.getItem('patientId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/patient/patientViewAllInsuranceProviders',
                    { patientId },
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
        navigate(`/patientViewOneInsuranceProvider`);
    };

    return (
<div className="d-flex flex-column min-vh-100">
    <PatientNavbar />
    <div className="flex-grow-1 container" style={{ paddingTop: '70px', paddingBottom: '70px', overflowY: 'auto' }}>
        {isLoading ? (
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        ) : providerList && providerList.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-3 g-4 pt-5 pb-5 justify-content-center">
                {providerList.map((provider, index) => (
                    <div
                        key={index}
                        className="col"
                        onClick={() => handleViewProvider(provider.insuranceProviderId)}
                    >
                        <div className="card h-100 border-primary"
                             onMouseOver={(e) => e.currentTarget.classList.add('shadow-lg')}
                             onMouseOut={(e) => e.currentTarget.classList.remove('shadow-lg')}
                             style={{ cursor: 'pointer', transition: 'transform .2s, box-shadow .2s' }}>
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="overflow-hidden rounded-circle border border-3 border-primary" style={{ width: '60px', height: '60px' }}>
                                        {provider.insuranceProviderProfileImage ? (
                                            <img
                                                src={provider.insuranceProviderProfileImage}
                                                className="img-fluid"
                                                alt="Insurance Provider"
                                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                            />
                                        ) : (
                                            <div className="d-flex justify-content-center align-items-center h-100">
                                                <span>No Image</span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-grow-1 ms-3">
                                        <h5 className="card-title">{provider.insuranceProviderName}</h5>
                                    </div>
                                </div>
                                <p className="card-text text-muted">
                                    <strong>Registered Date:</strong> {new Date(provider.registeredDate).toLocaleDateString()}
                                </p>
                                <p className="card-text text-muted">
                                    <strong>Status:</strong> {provider.isActive ? 'Active' : 'Inactive'}
                                </p>
                                <p className="card-text text-muted">
                                    <strong>Email:</strong> {provider.insuranceProviderEmail}
                                </p>
                                <p className="card-text text-muted">
                                    <strong>Phone:</strong> {provider.insuranceProviderMobile}
                                </p>
                                <p className="card-text text-muted">
                                    <strong>Address:</strong> {provider.insuranceProviderAddress}
                                </p>
                            </div>
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

export default PatientViewAllInsuranceProviders;
