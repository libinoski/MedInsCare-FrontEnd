import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../Common/Footer';
import InsuranceProviderNavbar from './InsuranceProviderNavbar';

const InsuranceProviderViewAllNews = () => {
    const navigate = useNavigate();
    const [allNews, setAllNews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAllNews = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const insuranceProviderId = sessionStorage.getItem('insuranceProviderId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/insuranceProvider/insuranceProviderViewAllNews',
                    { insuranceProviderId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setAllNews(response.data.data);
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
                            alert(data.error || 'Insurance provider not found or hospital not found or inactive.');
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

        fetchAllNews();
    }, [navigate]);

    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString('en-GB');
        const formattedTime = date.toLocaleTimeString('en-US', { hour12: false });
        return `${formattedDate} ${formattedTime}`;
    };

    const handleViewNews = (hospitalNewsId) => {
        sessionStorage.setItem('hospitalNewsId', hospitalNewsId);
        navigate('/insuranceProviderViewOneNews');
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <InsuranceProviderNavbar />
            <div className="container-fluid py-4" style={{ position: 'relative', flex: '1 0 auto' }}>
                <div className="container" style={{ maxWidth: '100%', padding: '0 15px', overflowY: 'auto', maxHeight: 'calc(100% - 100px)' }}>
                    {isLoading ? (
                        <div className="d-flex justify-content-center">
                            <div className="spinner-border" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
                            {allNews.length > 0 ? (
                                allNews.map((news, index) => (
                                    <div className="col" key={index} onClick={() => handleViewNews(news.hospitalNewsId)} style={{ cursor: 'pointer' }}>
                                        <div className="card h-100 border-0 shadow mb-3" style={{ overflow: 'hidden' }}>
                                            <img src={news.hospitalNewsImage} className="card-img-top img-fluid" alt="News" style={{ objectFit: 'contain', height: '200px', maxWidth: '100%' }} />
                                            <div className="card-body" style={{ background: '#f0f0f0', padding: '20px', maxHeight: '300px', overflow: 'hidden' }}> 
                                                <h5 className="card-title" style={{ background: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px', backdropFilter: 'blur(5px)', padding: '10px', marginBottom: '15px' }}>{news.hospitalNewsTitle}</h5>
                                                <p className="card-text text-muted" style={{ marginBottom: '10px' }}>{formatDate(news.addedDate)}</p>
                                                <p className="card-text">{news.hospitalNewsContent}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center w-100">No news available.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default InsuranceProviderViewAllNews;
