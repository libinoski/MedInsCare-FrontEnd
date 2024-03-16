import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import InsuranceProviderNavbar from './InsuranceProviderNavbar';

const InsuranceProviderViewOneClient = () => {
    const navigate = useNavigate();
    const [clientDetails, setclientDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchclientDetails = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const insuranceProviderId = sessionStorage.getItem('insuranceProviderId');
                const clientId = sessionStorage.getItem('clientId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/insuranceProvider/insuranceProviderViewOneclient',
                    { insuranceProviderId, clientId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setclientDetails(response.data.data);
                }
            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response;
                    switch (status) {
                        case 401:
                        case 403:
                            alert(data.message || 'Unauthorized access. Please login again.');
                            navigate('/insuranceProviderLogin');
                            break;
                        case 422:
                            const errorMessage422 = data.error || "An error occurred while fetching client details.";
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

        fetchclientDetails();
    }, [navigate]);

    const handleSendNotificationToclient = () => {
        navigate('/insuranceProviderSendNotificationToClient');
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
    <InsuranceProviderNavbar />
    <div className="container-fluid py-5" style={{ backgroundColor: '#f0f4f7', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <div className="container" style={{ maxWidth: '100%', padding: '0 15px', overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
            {isLoading ? (
                <p className="text-center">Loading client details...</p>
            ) : (
                <div className="row justify-content-center flex-grow-1">
                    <div className="col-lg-8 d-flex flex-column" style={{ height: '100%' }}>
                        {clientDetails ? (
                            <div className="card shadow flex-grow-1" style={{ borderRadius: '20px', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                                <div className="d-flex flex-wrap justify-content-end" style={{ position: 'absolute', top: '20px', right: '20px' }}>
                                    {/* Possible additional content */}
                                </div>
                                <div className="card-body p-4 p-md-5" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                    <div className="row align-items-center">
                                        <div className="col-md-6 text-center mb-4 mb-md-0">
                                            <img
                                                src={clientDetails.clientProfileImage}
                                                alt="Profile"
                                                className="img-fluid rounded-circle border"
                                                style={{ width: '200px', height: '200px', objectFit: 'cover', border: '5px solid #ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <h2 className="card-title" style={{ color: '#0056b3' }}>{clientDetails.clientName}</h2>
                                            <p className="mb-2"><strong>Email:</strong> {clientDetails.clientEmail}</p>
                                            <p className="mb-2"><strong>Aadhar:</strong> {clientDetails.clientAadhar}</p>
                                            <p className="mb-2"><strong>Mobile:</strong> {clientDetails.clientMobile}</p>
                                            <p className="mb-2"><strong>Address:</strong> {clientDetails.clientAddress}</p>

                                            <p><strong>Admitted Date:</strong> {formatDate(clientDetails.registeredDate)}</p> {/* Format the date here */}
                                        </div>
                                    </div>
                                </div>
                                <div className="d-flex justify-content-end p-2" style={{ gap: '10px' }}>
                                    <button
                                        className="btn btn-outline-secondary text-dark"
                                        onClick={handleSendNotificationToclient}
                                        style={{
                                            border: '2px solid #6c757d',
                                            color: '#6c757d',
                                            fontWeight: 'bold',
                                            boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
                                            padding: '10px 20px',
                                            borderRadius: '25px'
                                        }}
                                    >
                                        Send Notification
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center">No client details found.</p>
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

export default InsuranceProviderViewOneClient;
