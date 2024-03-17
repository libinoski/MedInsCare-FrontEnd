import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import InsuranceProviderNavbar from './InsuranceProviderNavbar';
import Footer from '../Common/Footer';


const InsuranceProviderViewOneNews = () => {
    const navigate = useNavigate();
    const [newsDetails, setNewsDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString('en-GB');
        const formattedTime = date.toLocaleTimeString('en-US', { hour12: false });
        return `${formattedDate} ${formattedTime}`;
    };

    useEffect(() => {
        const fetchNewsDetails = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const insuranceProviderId = sessionStorage.getItem('insuranceProviderId');
                const hospitalNewsId = sessionStorage.getItem('hospitalNewsId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/insuranceProvider/insuranceProviderViewOneNews',
                    { insuranceProviderId, hospitalNewsId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setNewsDetails(response.data.data);
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
                            alert(data.error || "An error occurred while fetching news details.");
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

        fetchNewsDetails();
    }, [navigate]);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <InsuranceProviderNavbar />
            <div className="container-fluid d-flex justify-content-center align-items-center" style={{ paddingTop: '56px', paddingBottom: '80px', minHeight: '100vh' }}>
                <div className="col-lg-8">
                    {isLoading ? (
                        <p className="text-center">Loading news details...</p>
                    ) : (
                        <div className="card" style={{ borderRadius: '10px' }}>
                            {newsDetails ? (
                                <div className="row g-0">
                                    <div className="col-md-6">
                                        <div style={{ maxHeight: '400px', overflow: 'hidden' }}>
                                            <img
                                                src={newsDetails.hospitalNewsImage}
                                                className="img-fluid rounded-end"
                                                alt="News"
                                                style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="col-md-6 d-flex flex-column justify-content-between">
                                        <div className="card-body">
                                            <h5 className="card-title text-center mb-4" style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{newsDetails.hospitalNewsTitle}</h5>
                                            <p className="card-text" style={{ fontSize: '18px', lineHeight: '1.6', color: '#333' }}>{newsDetails.hospitalNewsContent}</p>
                                            <p className="card-text" style={{ backgroundColor: 'yellow', padding: '5px', borderRadius: '5px', color: '#333' }}>Published on: {formatDate(newsDetails.addedDate)}</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center">No news details found.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default InsuranceProviderViewOneNews;
