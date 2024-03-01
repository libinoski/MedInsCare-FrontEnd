import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/Hospital/doc.jpg'; // Import the background image

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
<div>
    <Navbar />
    <div className="container-fluid" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', position: 'relative' }}>
        <div className="container" style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', padding: '0 15px', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
            {isLoading ? (
                <p className="text-center">Loading unapproved insurance providers...</p>
            ) : (
                <div className="d-flex flex-column align-items-center justify-content-center">
                    {unapprovedProviders.length > 0 ? (
                        <div className="w-100">
                            {unapprovedProviders.map((provider, index) => (
                                <div className="d-flex align-items-center justify-content-start bg-white shadow rounded-3 mb-3 p-3" key={index} onClick={() => handleViewDetails(provider.insuranceProviderId)} style={{ cursor: 'pointer', backdropFilter: 'blur(5px)', backgroundColor: 'rgba(255, 255, 255, 0.85)', width: 'calc(100% - 30px)', border: '2px solid #ff0000', borderRadius: '10px' }}>
                                    <div className="me-3">
                                        <div className="d-flex justify-content-center align-items-center rounded-circle border border-primary" style={{ width: '60px', height: '60px', overflow: 'hidden' }}>
                                            <img src={provider.insuranceProviderProfileImage} className="img-fluid" alt="Provider Logo" style={{ objectFit: 'cover', minWidth: '100%', minHeight: '100%' }} />
                                        </div>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="mb-1 fw-bold text-dark">{provider.insuranceProviderName}</h5>
                                        <p className="mb-1 text-muted"><strong>Email:</strong> {provider.insuranceProviderEmail}</p>
                                        <p className="mb-1 text-muted"><strong>Phone:</strong> {provider.insuranceProviderMobile}</p>
                                        <p className="mb-0 text-muted"><strong>Address:</strong> {provider.insuranceProviderAddress}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center mt-4">No unapproved insurance providers available.</p>
                    )}
                </div>
            )}
        </div>
    </div>
    <Footer />
</div>













    );
};

export default HospitalViewAllUnapprovedInsuranceProviders;
