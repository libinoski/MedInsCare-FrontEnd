import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import HospitalNavbar from './HospitalNavbar';

const HospitalViewOneDischargeRequest = () => {
    const navigate = useNavigate();
    const [dischargeRequestDetails, setDischargeRequestDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchDischargeRequestDetails = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const requestId = sessionStorage.getItem('requestId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewOneDischargeRequest',
                    { hospitalId, requestId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setDischargeRequestDetails(response.data.data);
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
                            const errorMessage422 = data.error || "An error occurred while fetching discharge request details.";
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchDischargeRequestDetails();
    }, [navigate]);

    // Function to format date and time
    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
        const formattedTime = date.toLocaleTimeString('en-US', { hour12: false }); // Format: HH:MM
        return `${formattedDate} ${formattedTime}`;
    };

    const handleApproveDischarge = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const requestId = sessionStorage.getItem('requestId');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/approveOneDischargeRequest',
                { hospitalId, requestId },
                {
                    headers: {
                        token
                    }
                }
            );
            if (response.status === 200) {
                alert('Discharge request approved successfully.');
                // Optionally, you can redirect to another page or refresh the data after approval
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
                        const errorMessage422 = data.error || "An error occurred while approving discharge request.";
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
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HospitalNavbar />
            <div className="container-fluid py-5" style={{ flex: '1 0 auto' }}>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 d-flex justify-content-center">
                        {isLoading ? (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading discharge request details...</span>
                                </div>
                            </div>
                        ) : dischargeRequestDetails ? (
                            <div className="card shadow" style={{ borderRadius: '20px', overflow: 'hidden', maxWidth: '600px' }}>
                                <div className="card-body p-4 p-md-5">
                                    <div className="d-flex align-items-center mb-3">
                                        
                                            <h5 className="card-title">Discharge Request</h5>
                                            <p className="card-text">
                                                <small className="text-muted">Patient Name: {dischargeRequestDetails.patientName}</small><br />
                                                <small className="text-muted">Patient Email: {dischargeRequestDetails.patientEmail}</small><br />
                                                <small className="text-muted">Staff ID: {dischargeRequestDetails.hospitalStaffId}</small><br />
                                                <small className="text-muted">Staff Email: {dischargeRequestDetails.hospitalStaffEmail}</small><br />
                                                <small className="text-muted">Message: {dischargeRequestDetails.message}</small><br />
                                                <small className="text-muted">Send Date: {formatDate(dischargeRequestDetails.sendDate)}</small><br />
                                            </p>
                                    </div>
                                </div>
                                <div className="card-footer d-flex justify-content-center bg-transparent">
                                    <button
                                        className="btn mx-2 btn-outline-secondary text-dark"
                                        onClick={handleApproveDischarge}
                                        style={{
                                            border: '2px solid #6c757d',
                                            color: '#6c757d',
                                            fontWeight: 'bold',
                                            padding: '10px 20px',
                                            borderRadius: '25px'
                                        }}
                                    >
                                        Approve Discharge
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center">No discharge request details found.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer className="mt-auto" />
        </div>
    );
};

export default HospitalViewOneDischargeRequest;
