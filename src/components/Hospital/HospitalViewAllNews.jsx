import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Footer from '../Common/Footer';
import HospitalNavbar from './HospitalNavbar';

const HospitalViewAllNews = () => {
    const navigate = useNavigate();
    const [allNews, setAllNews] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchAllNews = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewAllHospitalNews',
                    { hospitalId },
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
                            navigate('/hospitalLogin');
                            break;
                        case 422:
                            alert(data.error || 'Hospital not found.');
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

    // Function to format date and time
    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
        const formattedTime = date.toLocaleTimeString('en-US', { hour12: false }); // Format: HH:MM
        return `${formattedDate} ${formattedTime}`;
    };

    const handleViewNews = (newsId) => {
        sessionStorage.setItem('hospitalNewsId', newsId);
        navigate('/hospitalViewOneNews');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

<HospitalNavbar />
    {isLoading ? (
        <div className="d-flex justify-content-center align-items-center flex-grow-1">
            <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    ) : (
        <div className="container-fluid py-4" style={{ flex: '1', position: 'relative', overflowY: 'auto' }}>
            <div className="container" style={{ maxWidth: '100%', padding: '0 15px' }}>
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 justify-content-center">
                    {allNews.length > 0 ? (
                        allNews.map((news, index) => (
                            <div className="col" key={index} onClick={() => handleViewNews(news.hospitalNewsId)} style={{ cursor: 'pointer' }}>
                                <div className="card h-100 shadow-sm mb-3" style={{
                                    overflow: 'hidden',
                                    transition: 'transform 0.3s ease, boxShadow 0.3s ease',
                                    borderRadius: '15px',
                                    border: '1px solid transparent'
                                }}
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
                                    <img src={news.hospitalNewsImage} className="card-img-top img-fluid" alt="News" style={{
                                        objectFit: 'cover', // Changed from 'contain' to 'cover' for a more consistent appearance
                                        height: '200px',
                                        maxWidth: '100%',
                                        borderTopLeftRadius: '15px', // Added for consistency with card borderRadius
                                        borderTopRightRadius: '15px', // Added for consistency with card borderRadius
                                    }} />
                                    <div className="card-body" style={{
                                        background: '#f0f0f0',
                                        padding: '20px',
                                        maxHeight: '300px',
                                        overflow: 'hidden', // Adjust overflow as needed
                                        position: 'relative', // Needed for consistent text overlay
                                    }}>
                                        <h5 className="card-title" style={{
                                            background: 'rgba(255, 255, 255, 0.8)',
                                            borderRadius: '5px',
                                            backdropFilter: 'blur(5px)',
                                            padding: '10px',
                                            marginBottom: '15px'
                                        }}>{news.hospitalNewsTitle}</h5>
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
            </div>
        </div>
    )}
    <Footer />
</div>



    );
};

export default HospitalViewAllNews;
