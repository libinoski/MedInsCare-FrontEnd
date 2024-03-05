import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

const HospitalViewOneInsuranceProvider = () => {
    const navigate = useNavigate();
    const [providerDetails, setProviderDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProviderDetails = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const insuranceProviderId = sessionStorage.getItem('insuranceProviderId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewOneInsuranceProvider',
                    { hospitalId, insuranceProviderId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setProviderDetails(response.data.data);
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
                            const errorMessage422 = data.error || "An error occurred while fetching provider details.";
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

        fetchProviderDetails();
    }, [navigate]);

    const handleDeleteProvider = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this provider?");
        if (!confirmed) return;

        try {
            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const insuranceProviderId = sessionStorage.getItem('insuranceProviderId');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/deleteOneInsuranceProvider',
                { hospitalId, insuranceProviderId },
                {
                    headers: {
                        token
                    }
                }
            );
            if (response.status === 200) {
                alert(response.data.message);
                navigate('/hospitalViewAllInsuranceProviders'); // Redirect to the home page or any other appropriate page
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
                        const errorMessage422 = data.error || "An error occurred while deleting the provider.";
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
        }
    };

    const handleSuspendProvider = async () => {
        const confirmed = window.confirm("Are you sure you want to suspend this provider?");
        if (!confirmed) return;

        try {
            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const insuranceProviderId = sessionStorage.getItem('insuranceProviderId');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/suspendInsuranceProvider',
                { hospitalId, insuranceProviderId },
                {
                    headers: {
                        token
                    }
                }
            );
            if (response.status === 200) {
                alert(response.data.message);
                navigate('/hospitalViewAllInsuranceProviders');
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
                        const errorMessage422 = data.error || "An error occurred while suspending the provider.";
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
        }
    };

    const handleSendNotificationToProvider = () => {
        navigate('/hospitalSendNotificationToInsuranceProvider');
    };

    return (
<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <div className="container-fluid py-5" style={{ backgroundColor: '#f0f4f7', flex: '1' }}>
        <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
                {isLoading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading provider details...</span>
                        </div>
                    </div>
                ) : providerDetails ? (
                    <div className="card shadow" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                        <div className="card-body p-4 p-md-5">
                            <div className="row align-items-center">
                                <div className="col-md-6 text-center mb-4 mb-md-0">
                                    <img
                                        src={providerDetails.insuranceProviderProfileImage}
                                        alt="Profile"
                                        className="img-fluid rounded-circle border"
                                        style={{ width: '200px', height: '200px', objectFit: 'cover', border: '5px solid #ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <h2 className="card-title" style={{ color: '#0056b3' }}>{providerDetails.insuranceProviderName}</h2>
                                    <p className="mb-2"><strong>Email:</strong> {providerDetails.insuranceProviderEmail}</p>
                                    <p className="mb-2"><strong>Aadhar:</strong> {providerDetails.insuranceProviderAadhar}</p>
                                    <p className="mb-2"><strong>Mobile:</strong> {providerDetails.insuranceProviderMobile}</p>
                                    <p className="mb-2"><strong>Address:</strong> {providerDetails.insuranceProviderAddress}</p>
                                    <p><strong>Added Date:</strong> {providerDetails.addedDate}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer text-muted" style={{ backgroundColor: '#eaeff3' }}>
                            <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3">
                                <button className="btn" onClick={handleDeleteProvider} style={{ backgroundImage: 'linear-gradient(135deg, #ff416c, #ff4b2b)', color: 'white' }}>Delete Provider</button>
                                <button className="btn" onClick={handleSuspendProvider} style={{ backgroundImage: 'linear-gradient(135deg, #FFD200, #F7971E)', color: 'white' }}>Suspend Provider</button>
                                <button className="btn" onClick={handleSendNotificationToProvider} style={{ backgroundImage: 'linear-gradient(135deg, #00B4DB, #0083B0)', color: 'white' }}>Send Notification</button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center">No provider details found.</p>
                )}
            </div>
        </div>
    </div>
    <Footer />
</div>
    );
};

export default HospitalViewOneInsuranceProvider;
