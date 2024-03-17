import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../Common/Footer';
import { useNavigate } from 'react-router-dom';
import PatientNavbar from './PatientNavbar';

const PatientAddReview = () => {
    const [reviewContent, setReview] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const patientId = sessionStorage.getItem('patientId');
            const insuranceProviderId = sessionStorage.getItem('insuranceProviderId');
            const response = await axios.post(
                'http://localhost:1313/api/mic/patient/patientReviewOneInsuranceProvider',
                { insuranceProviderId, patientId, reviewContent },
                {
                    headers: {
                        'token': token,
                        'Content-Type': 'application/json'
                    },
                }
            );
            if (response.status === 200) {
                navigate('/patientViewAllInsuranceProviders', { state: { patientId } }); 
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        setError(data.results || 'Validation failed.');
                        break;
                    case 401:
                    case 403:
                        setError(data.message || 'Unauthorized access. Please log in again.');
                        break;
                    case 422:
                        setError(data.error || 'Hospital not found or staff not active.');
                        break;
                    case 500:
                        setError(data.message || 'Internal server error. Please try again later.');
                        break;
                    default:
                        setError('An error occurred. Please try again.');
                        break;
                }
            } else {
                setError('An error occurred. Please check your connection and try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <PatientNavbar />
            <div className="container-fluid" style={{ position: 'relative', backgroundColor: '#f0f2f7', paddingTop: '56px', flex: '1' }}>
                <div className="container py-5">
                    <div className="row d-flex justify-content-center align-items-center">
                        <div className="col-lg-6">
                            <div className="card bg-transparent border-0" style={{ backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', borderRadius: '15px', maxWidth: '100%' }}>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
                                        <div className="mb-4">
                                            <label htmlFor="notificationMessage" className="form-label" style={{ fontWeight: '500' }}>Content:</label>
                                            <textarea
                                                value={reviewContent}
                                                onChange={(e) => setReview(e.target.value)}
                                                className="form-control"
                                                id="reviewContent"
                                                rows="5"
                                                style={{ borderRadius: '15px', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)' }}
                                            ></textarea>
                                        </div>
                                        {error && <div className="alert alert-danger" style={{ borderRadius: '15px' }}>{error.reviewContent}</div>}
                                        <div className="text-center">
                                            <button
                                                type="submit"
                                                className="btn btn-outline-secondary text-dark"
                                                style={{
                                                    border: '2px solid #6c757d',
                                                    fontWeight: 'bold',
                                                    borderRadius: '25px',
                                                    width: '100%',
                                                    maxWidth: '200px',
                                                }}
                                                disabled={isLoading} // Disable button when loading
                                            >
                                                {isLoading ? 'Sending...' : 'Send review'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PatientAddReview;
