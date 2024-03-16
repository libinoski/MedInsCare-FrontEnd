import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './PatientNavbar';
import Footer from '../Common/Footer';

const PatientViewOneInsuranceProvider = () => {
    const navigate = useNavigate();
    const [providerDetails, setProviderDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProviderDetails = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const patientId = sessionStorage.getItem('patientId');
                const insuranceProviderId = sessionStorage.getItem('insuranceProviderId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/patient/patientViewOneInsuranceProvider',
                    { patientId, insuranceProviderId },
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
                            navigate('/patientLogin');
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

    const handleReviewInsuranceProvider = () => {
        navigate('/patientAddReview');
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
                                    <button
                                        onClick={handleReviewInsuranceProvider}
                                        className="btn btn-outline-secondary text-dark"
                                        style={{
                                            border: '2px solid #6c757d',
                                            color: '#6c757d',
                                            fontWeight: 'bold',
                                            boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
                                            padding: '0.375rem 0.75rem',
                                            borderRadius: '0.25rem',
                                        }}
                                    >
                                        Add Review
                                    </button>
                                </div>
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

export default PatientViewOneInsuranceProvider;
