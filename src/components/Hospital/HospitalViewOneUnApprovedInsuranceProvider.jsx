import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/Hospital/bg1.jpg'; // Import the background image

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
        <div>
            <Navbar />
            <div className="container-fluid py-5" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="container" style={{ maxWidth: '100%', padding: '0 15px', overflowY: 'auto', maxHeight: '100%' }}>
                    {isLoading ? (
                        <p className="text-center">Loading provider details...</p>
                    ) : (
                        <div className="row justify-content-center">
                            <div className="col-lg-6">
                                {providerDetails ? (
                                    <div className="card shadow-lg border-0">
                                        <div className="card-body">
                                            <div className="d-flex justify-content-center mb-4">
                                                <div className="rounded-circle" style={{ width: '200px', height: '200px', background: `url(${providerDetails.insuranceProviderProfileImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
                                            </div>
                                            <h5 className="card-title text-center mt-3 mb-4">{providerDetails.insuranceProviderName}</h5>
                                            <ul className="list-unstyled mb-4">
                                                <li><strong>Email:</strong> {providerDetails.insuranceProviderEmail}</li>
                                                <li><strong>Aadhar:</strong> {providerDetails.insuranceProviderAadhar}</li>
                                                <li><strong>Mobile:</strong> {providerDetails.insuranceProviderMobile}</li>
                                                <li><strong>Address:</strong> {providerDetails.insuranceProviderAddress}</li>
                                                <li><strong>Registered Date:</strong> {formatDate(providerDetails.RegisteredDate)}</li>
                                            </ul>
                                            <div className="text-center">
                                                <img src={providerDetails.insuranceProviderIdProofImage} alt="Provider ID Proof" style={{ maxWidth: '100%', height: 'auto', objectFit: 'cover', borderRadius: '10px' }} />
                                            </div>
                                        </div>
                                        <div className="card-footer d-flex justify-content-center">
                                            <button className="btn btn-success me-3" onClick={handleApproveProvider}>Approve</button>
                                            <button className="btn btn-danger" onClick={handleDeleteProvider}>Delete</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-center">No provider details found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HospitalViewOneUnapprovedInsuranceProvider;
