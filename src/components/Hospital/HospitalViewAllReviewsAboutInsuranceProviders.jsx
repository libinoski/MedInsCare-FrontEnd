import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';


const HospitalViewAllReviews = () => {
    const navigate = useNavigate();
    const [reviewList, setreviewList] = useState([]);
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
                        const errorMessage422 = data.error || "An error occurred while fetching reviews.";
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
        };

        const fetchreviews = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewAllReviews',
                    { hospitalId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setreviewList(response.data.data);
                    const reviewId = response.data.data.map(review => review.reviewId);
                    sessionStorage.setItem('reviewId', reviewId);
                }
            } catch (error) {
                handleErrors(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchreviews();
    }, [navigate]);

    const handleViewreview = (reviewId) => {
        sessionStorage.setItem('reviewId', reviewId);
        navigate(`/hospitalViewOnereview`);
    };

    return (
<div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
    <div>
        <Navbar />
    </div>
    <div className="container flex-grow-1" style={{ overflowY: 'auto', paddingTop: '70px', paddingBottom: '70px' }}>
        {isLoading ? (
            <div className="text-center alert alert-info">Loading reviews...</div>
        ) : reviewList.length > 0 ? (
            <div className="d-flex flex-wrap justify-content-center pt-5 pb-5">
                {reviewList.map((review, index) => (
                    <div
                        key={index}
                        className="card shadow-sm rounded-3 mb-3 mx-2" style={{ width: '18rem', cursor: 'pointer' }}
                        onClick={() => handleViewreview(review.reviewId)}
                    >
                        <div className="card-body">
 
                            <h5 className="card-title">{review.reviewContent}</h5>
                            <p className="card-text">{review.insuranceProviderName}</p>
                            <p className="card-text">{review.patientName}</p>

                            <p className="card-text">{review.sendDate}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center alert alert-warning mt-4">No reviews found.</div>
        )}
    </div>
    <div>
        <Footer />
    </div>
</div>

    );
};

export default HospitalViewAllReviews;

