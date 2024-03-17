import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HospitalNavbar from './HospitalNavbar';
import Footer from '../Common/Footer';


const HospitalViewOnePaidBill = () => {
    const navigate = useNavigate();
    const [billDetails, setBillDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Function to format date and time
    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
        const formattedTime = date.toLocaleTimeString('en-US', { hour12: false }); // Format: HH:MM
        return `${formattedDate} ${formattedTime}`;
    };

    useEffect(() => {
        const fetchBillDetails = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const billId = sessionStorage.getItem('billId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewOnePaidBill',
                    { hospitalId, billId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setBillDetails(response.data.data);
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
                            const errorMessage422 = data.error || "An error occurred while fetching bill details.";
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

        fetchBillDetails();
    }, [navigate]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <HospitalNavbar />
            <div className="container-fluid py-5" style={{ flex: '1' }}>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 d-flex justify-content-center">
                        {isLoading ? (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading bill details...</span>
                                </div>
                            </div>
                        ) : billDetails ? (
                            <div className="card shadow" style={{ borderRadius: '20px', overflow: 'hidden', maxWidth: '600px' }}>
                                <div className="card-body p-4 p-md-5">
                                    <h2 className="card-title" style={{ color: '#0056b3' }}>Bill Details</h2>
                                    <p className="mb-2"><strong>Bill ID:</strong> {billDetails.billId}</p>
                                    <p className="mb-2"><strong>Generated Date:</strong> {formatDate(billDetails.generatedDate)}</p>
                                    <p className="mb-2"><strong>Costs Explained:</strong> {billDetails.costsExplained}</p>
                                    <p className="mb-2"><strong>Total Amount:</strong> {billDetails.totalAmount}</p>
                                    <p className="mb-2"><strong>Cancelled Status:</strong> {billDetails.isCancelled === "1" ? 'Yes' : 'No'}</p>
                                    {billDetails.isCancelled === "1" && billDetails.cancelledDate && (
                                        <p className="mb-2"><strong>Cancelled Date:</strong> {formatDate(billDetails.cancelledDate)}</p>
                                    )}

                                    {/* Display other bill details here */}
                                </div>
                            </div>
                        ) : (
                            <p className="text-center">No bill details found.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HospitalViewOnePaidBill;
