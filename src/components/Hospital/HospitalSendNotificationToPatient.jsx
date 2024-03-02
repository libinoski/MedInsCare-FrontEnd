import React, { useState } from 'react';
import axios from 'axios';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/HospitalStaff/7475685_3674981.svg'; // Import the background image
import { useNavigate } from 'react-router-dom';

const HospitalSendNotificationToPatient = () => {
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!notificationMessage.trim()) {
            setError('Message cannot be empty.');
            return;
        }

        const confirmed = window.confirm("Are you sure you want to send this notification to the patient?");
        if (!confirmed) return;

        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const patientId = sessionStorage.getItem('patientId');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/sendNotificationToPatient',
                { hospitalId, patientId, notificationMessage },
                {
                    headers: {
                        'token': token,
                        'Content-Type': 'application/json'
                    },
                }
            );
            if (response.status === 200) {
                // alert(response.data.message);
                navigate('/hospitalViewOnePatient', { state: { patientId } });
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        setError(data.error || 'Validation failed.');
                        break;
                    case 401:
                    case 403:
                        setError(data.message || 'Unauthorized access. Please log in again.');
                        break;
                    case 422:
                        setError(data.error || 'Hospital not found or patient not active.');
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
        <div style={{ position: 'relative', minHeight: '100vh' }}>
            {/* Navbar */}
            <Navbar />
            <div className="container-fluid bg-blur" style={{ paddingTop: '56px' }}>
                <div className="container py-5">
                    <div className="row">
                        {/* Left Side Image Container */}
                        <div className="col-lg-6 d-flex justify-content-center align-items-center">
                            <img src={backgroundImage} className="img-fluid" alt="Background" style={{ maxHeight: '100%', width: 'auto' }} />
                        </div>
                        {/* Right Side Profile Details Card */}
                        <div className="col-lg-6 d-flex justify-content-center align-items-center">
                            <div className="card bg-transparent border-0" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)', maxWidth: '100%' }}>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
                                        <div className="mb-3">
                                            <label htmlFor="notificationMessage" className="form-label">Message:</label>
                                            <textarea
                                                value={notificationMessage}
                                                onChange={(e) => setNotificationMessage(e.target.value)}
                                                className="form-control"
                                                id="notificationMessage"
                                                rows="5"
                                                style={{ width: '100%' }}
                                            ></textarea>
                                        </div>
                                        {error && <div className="alert alert-danger">{error}</div>}
                                        <div className="text-center">
                                            <button type="submit" className={`btn ${isLoading ? 'btn-secondary' : 'btn-primary'}`} disabled={isLoading}>
                                                {isLoading ? 'Sending...' : 'Send Notification'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Footer */}
            <Footer />
        </div>
    );
};

export default HospitalSendNotificationToPatient;
