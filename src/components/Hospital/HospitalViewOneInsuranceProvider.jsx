import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import HospitalNavbar from './HospitalNavbar';

const HospitalViewOneInsuranceProvider = () => {
    const navigate = useNavigate();
    const [insuranceProviderDetails, setInsuranceProviderDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleRequestError = useCallback((error) => {
        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 401:
                case 403:
                    alert(data.message || 'Unauthorized access. Please login again.');
                    navigate('/hospitalLogin');
                    break;
                case 422:
                    const errorMessage422 = data.error || "An error occurred.";
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
    }, [navigate]);

    useEffect(() => {
        const fetchInsuranceProviderDetails = async () => {
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
                    setInsuranceProviderDetails(response.data.data);
                }
            } catch (error) {
                handleRequestError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchInsuranceProviderDetails();
    }, [handleRequestError]);

    const handleSuspendInsuranceProvider = async () => {
        const confirmed = window.confirm("Are you sure you want to suspend this insurance provider?");
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
                // Optionally, you can reload or redirect to refresh the insurance provider details
                // window.location.reload();
            }
        } catch (error) {
            handleRequestError(error);
        }
    };

    const handleDeleteInsuranceProvider = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this insurance provider?");
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
                // Optionally, you can navigate to another page after successful deletion
                // navigate('/someOtherPage');
            }
        } catch (error) {
            handleRequestError(error);
        }
    };

    const handleSendNotificationToProvider = () => {
        navigate('/hospitalSendNotificationToInsuranceProvider');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

<HospitalNavbar />
    <div className="container-fluid py-5" style={{ backgroundColor: '#f0f4f7', flex: '1' }}>
        <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8 d-flex justify-content-center"> {/* Centering the content */}
                {isLoading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading provider details...</span>
                        </div>
                    </div>
                ) : insuranceProviderDetails ? (
                    <div className="card shadow" style={{ borderRadius: '20px', overflow: 'hidden', maxWidth: '600px' }}> {/* Adjusted card width */}
                        <div className="card-body p-4 p-md-5">
                            <div className="row align-items-center">
                                <div className="col-md-6 text-center mb-4 mb-md-0">
                                    <img
                                        src={insuranceProviderDetails.insuranceProviderProfileImage}
                                        alt="Profile"
                                        className="img-fluid rounded-circle border"
                                        style={{ width: '200px', height: '200px', objectFit: 'cover', border: '5px solid #ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <h2 className="card-title" style={{ color: '#0056b3' }}>{insuranceProviderDetails.insuranceProviderName}</h2>
                                    <p className="mb-2"><strong>Email:</strong> {insuranceProviderDetails.insuranceProviderEmail}</p>
                                    <p className="mb-2"><strong>Aadhar:</strong> {insuranceProviderDetails.insuranceProviderAadhar}</p>
                                    <p className="mb-2"><strong>Mobile:</strong> {insuranceProviderDetails.insuranceProviderMobile}</p>
                                    <p className="mb-0"><strong>Address:</strong> {insuranceProviderDetails.insuranceProviderAddress}</p>
                                    <p className="mb-0"><strong>Added Date:</strong> {insuranceProviderDetails.addedDate}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer text-muted" style={{ backgroundColor: '#eaeff3' }}>
                            <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3">
                                <button className="btn btn-outline-secondary text-dark" onClick={handleDeleteInsuranceProvider} style={{ border: '2px solid #6c757d', color: '#6c757d', fontWeight: 'bold', boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)', padding: '10px 20px', borderRadius: '25px' }}>Delete Provider</button>
                                <button className="btn btn-outline-secondary text-dark" onClick={handleSuspendInsuranceProvider} style={{ border: '2px solid #6c757d', color: '#6c757d', fontWeight: 'bold', boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)', padding: '10px 20px', borderRadius: '25px' }}>Suspend Provider</button>
                                <button className="btn btn-outline-secondary text-dark" onClick={handleSendNotificationToProvider} style={{ border: '2px solid #6c757d', color: '#6c757d', fontWeight: 'bold', boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)', padding: '10px 20px', borderRadius: '25px' }}>Send Notification</button>
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
