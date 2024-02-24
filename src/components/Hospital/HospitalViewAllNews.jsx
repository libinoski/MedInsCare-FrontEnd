import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';

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

    return (
        <div>
            <Navbar />
            <div className="container">
                <h2 className="text-center mt-5 mb-4">All Hospital News</h2>
                {isLoading ? (
                    <p className="text-center">Loading news...</p>
                ) : (
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            {allNews.length > 0 ? (
                                allNews.map((news, index) => (
                                    <div className="card mb-3" key={index}>
                                        <div className="card-body">
                                            <h5 className="card-title">{news.hospitalNewsTitle}</h5>
                                            <p className="card-text">{news.hospitalNewsContent}</p>
                                            <img src={news.hospitalNewsImage} className="img-fluid" alt="News" />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center">No news available.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HospitalViewAllNews;
