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

    const handleSendNotificationToClient = () => {
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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    {/* Navbar - positioned at the top */}
    <InsuranceProviderNavbar />

    {/* Main content area - centered card with client details */}
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '56px 0', flex: '1 0 auto' }}>
        {isLoading ? (
            <p className="text-center fs-4">Loading client details...</p>
        ) : clientDetails ? (
            <div className="card shadow-sm" style={{ maxWidth: '600px', borderRadius: '20px', overflow: 'hidden', backgroundColor: '#ffffff', color: '#000' }}>
                <div className="card-body p-4 p-md-5">
                    <div className="row align-items-center">
                        <div className="col-md-6 text-center mb-4 mb-md-0">
                            <img
                                src={clientDetails.clientProfileImage}
                                alt="Profile"
                                className="img-fluid rounded-circle"
                                style={{ width: '200px', height: '200px', objectFit: 'cover', border: '5px solid #ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.05)' }}
                            />
                        </div>
                        <div className="col-md-6">
                            <h2 className="card-title text-primary">{clientDetails.clientName}</h2>
                            <p className="mb-2"><strong>Email:</strong> {clientDetails.clientEmail}</p>
                            <p className="mb-2"><strong>Aadhar:</strong> {clientDetails.clientAadhar}</p> {/* Changed hospitalName to clientAadhar */}
                            <p className="mb-2"><strong>Package:</strong> {clientDetails.packageTitle}</p>
                            <p className="mb-2"><strong>Details:</strong> {clientDetails.packageDetails}</p>
                            <p className="mb-2"><strong>Duration:</strong> {clientDetails.packageDuration}</p>
                            <p className="mb-2"><strong>Amount:</strong> {clientDetails.packageAmount}</p>
                            <p><strong>Admitted Date:</strong> {formatDate(clientDetails.registeredDate)}</p> {/* Assuming formatDate is a function you have defined elsewhere */}
                        </div>
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-center pb-4">
                    <button
                        className="btn btn-outline-secondary text-dark"
                        onClick={handleSendNotificationToClient}
                        style={{
                            border: '2px solid #6c757d',
                            color: '#6c757d',
                            fontWeight: 'bold',
                            boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
                            padding: '10px 20px',
                            borderRadius: '25px',
                            transition: 'background-color .3s'
                        }}
                    >
                        Send Notification
                    </button>
                </div>
            </div>
        ) : (
            <p className="text-center fs-4">No client details found.</p>
        )}
    </div>

    {/* Footer - positioned at the bottom */}
    <Footer />
</div>


    );
};

export default InsuranceProviderViewOneClient;
