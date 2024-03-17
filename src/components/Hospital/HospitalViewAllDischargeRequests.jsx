import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import HospitalNavbar from './HospitalNavbar';

const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString('en-GB');
    const formattedTime = date.toLocaleTimeString('en-US', { hour12: false });
    return `${formattedDate} ${formattedTime}`;
};

const HospitalViewAllDischargeRequests = () => {
    const navigate = useNavigate();
    const [dischargeRequestList, setDischargeRequestList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleErrors = (error) => {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 422:
                        const errorMessage422 = data.error || "An error occurred while fetching discharge requests.";
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
        };

        const fetchDischargeRequests = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewAllDischargeRequests',
                    { hospitalId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setDischargeRequestList(response.data.data);
                }
            } catch (error) {
                handleErrors(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDischargeRequests();
    }, [navigate]);

    const handleViewDischargeRequest = (requestId) => {
        sessionStorage.setItem('requestId', requestId);
        navigate(`/hospitalViewOneDischargeRequest`);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HospitalNavbar />
            <div className="container flex-grow-1 my-5">
                {isLoading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading discharge requests...</span>
                        </div>
                    </div>
                ) : dischargeRequestList.length > 0 ? (
                    <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
                        {dischargeRequestList.map((request, index) => (
                            <div key={index} className="col">
                                <div
                                    className="card h-100 shadow-sm"
                                    style={{
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        borderRadius: '15px',
                                        border: '1px solid transparent'
                                    }}
                                    onClick={() => handleViewDischargeRequest(request.dischargeRequestId)}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                                        e.currentTarget.style.borderColor = '#007bff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                >
                                    <div className="card-body">
                                        <div className="d-flex align-items-center mb-3">
                                            <div>
                                                <h5 className="card-title">Discharge Request</h5>
                                                <p className="card-text">
                                                    <small className="text-muted">Patient Name: {request.patientName}</small><br />
                                                    <small className="text-muted">Patient Email: {request.patientEmail}</small><br />
                                                    <small className="text-muted">Staff ID: {request.hospitalStaffId}</small><br />
                                                    <small className="text-muted">Staff Email: {request.hospitalStaffEmail}</small><br />
                                                    <small className="text-muted">Message: {request.message}</small><br />
                                                    <small className="text-muted">Send Date: {formatDate(request.sendDate)}</small><br />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="alert alert-warning text-center" role="alert">
                        No discharge requests found.
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default HospitalViewAllDischargeRequests;
