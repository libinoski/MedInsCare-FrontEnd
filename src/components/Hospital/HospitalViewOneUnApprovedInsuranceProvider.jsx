import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

const HospitalViewOneUnapprovedInsuranceProvider = () => {
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
                    'http://localhost:1313/api/mic/hospital/viewOneUnapprovedInsuranceProvider',
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
                            alert(data.error || 'Unapproved insurance provider not found or already approved.');
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

    const handleApproveProvider = async () => {
        // Show a confirmation dialog before proceeding
        if (window.confirm("Are you sure you want to approve this provider?")) {
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const insuranceProviderId = sessionStorage.getItem('insuranceProviderId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/approveOneInsuranceProvider',
                    { hospitalId, insuranceProviderId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    // alert(response.data.message);
                    // Redirect to a suitable page after approval
                    navigate('/hospitalViewAllUnapprovedInsuranceProviders');
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
                            alert(data.error || 'Insurance provider not found or already approved.');
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
        }
    };

    const handleDeleteProvider = async () => {
        // Show a confirmation dialog before proceeding
        if (window.confirm("Are you sure you want to delete this provider?")) {
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
                    // alert(response.data.message);                    
                    // Redirect to a suitable page after deletion
                    navigate('/hospitalViewAllUnapprovedInsuranceProviders');
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
                            alert(data.error || 'Insurance provider not found or already deleted.');
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
        }
    };

    // Function to format date and time
    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
        const formattedTime = date.toLocaleTimeString('en-US', { hour12: false }); // Format: HH:MM
        return `${formattedDate} ${formattedTime}`;
    };

    return (
<div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <div>
        <Navbar />
        <div className="container-fluid py-5" style={{ paddingTop: '56px', paddingBottom: '80px', backgroundColor: '#f0f2f5', flex: '1' }}>
            <div className="row justify-content-center align-items-center">
                <div className="col-lg-8">
                    {isLoading ? (
                        <div className="text-center">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading provider details...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="col-lg-12 d-flex align-items-center justify-content-center">
                            {providerDetails ? (
                                <div className="card profile-card shadow border-0" style={{ borderRadius: '20px', maxWidth: '600px' }}> {/* Adjusted card width */}
                                    <div className="card-body">
                                        <div className="d-flex flex-column align-items-center mb-5">
                                            <div className="profile-picture bg-light rounded-circle shadow" style={{ width: '200px', height: '200px', overflow: 'hidden', border: '5px solid white' }}>
                                                <img src={providerDetails.insuranceProviderProfileImage} alt="Provider" className="img-fluid" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                                            </div>
                                            <h3 className="mt-4">{providerDetails.insuranceProviderName}</h3>
                                        </div>
                                        <div className="text-center">
                                            <p className="mb-2"><strong>Email:</strong> {providerDetails.insuranceProviderEmail}</p>
                                            <p className="mb-2"><strong>Mobile:</strong> {providerDetails.insuranceProviderMobile}</p>
                                            <p className="mb-2"><strong>Address:</strong> {providerDetails.insuranceProviderAddress}</p>
                                            <p className="mb-2"><strong>Aadhar:</strong> {providerDetails.insuranceProviderAadhar}</p>
                                            <p className="mb-2"><strong>Registered Date:</strong> {formatDate(providerDetails.registeredDate)}</p>
                                        </div>
                                    </div>
                                    <div className="card-footer d-flex justify-content-center bg-transparent border-top-0">
                                        <button 
                                            className="btn btn-outline-secondary text-dark me-3" 
                                            onClick={handleApproveProvider} 
                                            style={{
                                                borderRadius: '50px',
                                                padding: '10px 30px',
                                                boxShadow: '0 4px 8px rgba(0,0,0,.1)',
                                                border: '2px solid #6c757d',
                                                color: '#6c757d',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Approve
                                        </button>
                                        <button 
                                            className="btn btn-outline-secondary text-dark" 
                                            onClick={handleDeleteProvider} 
                                            style={{
                                                borderRadius: '50px',
                                                padding: '10px 30px',
                                                boxShadow: '0 4px 8px rgba(0,0,0,.1)',
                                                border: '2px solid #6c757d',
                                                color: '#6c757d',
                                                fontWeight: 'bold',
                                            }}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center">No provider details found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    <div style={{ marginTop: 'auto' }}>
        <Footer />
    </div>
</div>

    );
};

export default HospitalViewOneUnapprovedInsuranceProvider;
