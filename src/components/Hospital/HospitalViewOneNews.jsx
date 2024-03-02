// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/Hospital/hr.jpg'; // Import the background image

const HospitalViewOneNews = () => {
    const navigate = useNavigate();
    const [newsDetails, setNewsDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    // Function to format date and time
    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
        const formattedTime = date.toLocaleTimeString('en-US', { hour12: false }); // Format: HH:MM
        return `${formattedDate} ${formattedTime}`;
    };

    useEffect(() => {
        const fetchNewsDetails = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const hospitalNewsId = sessionStorage.getItem('hospitalNewsId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewOneHospitalNews',
                    { hospitalId, hospitalNewsId },
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
                            navigate('/hospitalLogin');
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

    const handleDeleteNews = async (newsId) => {
        try {
            // Ask for confirmation before deleting news
            const confirmDeletion = window.confirm('Are you sure you want to delete this news?');
            if (!confirmDeletion) {
                return;
            }

            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/deleteHospitalNews',
                { hospitalId, hospitalNewsId: newsId },
                {
                    headers: {
                        token
                    }
                }
            );
            if (response.status === 200) {
                // alert(response.data.message);
                navigate('/hospitalViewAllNews');
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
                        alert(data.error || "An error occurred while deleting the news.");
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
    };

    const handleUpdateNews = () => {
        navigate('/hospitalUpdateNews'); // Navigate to the update news page
    };

    return (
<div>
    <Navbar />
    <div className="container-fluid" style={{ paddingTop: '56px', paddingBottom: '80px' }}>
        <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="col-lg-6 d-flex align-items-center justify-content-center">
                {/* Ensure backgroundImage is not null */}
                {backgroundImage && (
                    <img src={backgroundImage} className="img-fluid" alt="Background" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                )}
            </div>
            <div className="col-lg-6 d-flex align-items-center justify-content-center">
                {/* Refactored content */}
                <div className="d-flex justify-content-center align-items-center" style={{ width: '100%', height: '100%' }}>
                    {isLoading ? (
                        <p className="text-center">Loading news details...</p>
                    ) : (
                        <div className="card w-100" style={{ borderRadius: '10px', position: 'relative' }}>
                            <div className="card-body">
                                {newsDetails ? (
                                    <>
                                        <h5 className="card-title text-center mb-4" style={{ fontSize: '24px', fontWeight: 'bold', color: '#333' }}>{newsDetails.hospitalNewsTitle}</h5>
                                        <img src={newsDetails.hospitalNewsImage} className="card-img-top" alt="News" style={{ width: '100%', borderRadius: '10px', objectFit: 'cover' }} />
                                        <p className="card-text" style={{ fontSize: '18px', lineHeight: '1.6', color: '#333' }}>{newsDetails.hospitalNewsContent}</p>
                                        <p className="card-text" style={{ backgroundColor: 'yellow', padding: '5px', borderRadius: '5px', color: '#333' }}>Published on: {formatDate(newsDetails.addedDate)}</p>
                                        {newsDetails.updatedDate && <p className="card-text" style={{ backgroundColor: 'lightgreen', padding: '5px', borderRadius: '5px', color: '#333' }}>Updated on: {formatDate(newsDetails.updatedDate)}</p>}
                                        <div className="d-flex justify-content-between align-items-center" style={{ marginTop: '20px' }}>
                                            <button className="btn btn-danger" onClick={() => handleDeleteNews(newsDetails.hospitalNewsId)}>Delete</button>
                                            <button className="btn btn-primary" onClick={handleUpdateNews}>Update</button>
                                        </div>
                                    </>
                                ) : (
                                    <p className="text-center">No news details found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    <Footer />
</div>







    );
};

export default HospitalViewOneNews;
