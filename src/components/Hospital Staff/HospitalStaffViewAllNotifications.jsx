import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import HospitalStaffNavbar from './HospitalStaffNavbar';
import Footer from '../Common/Footer';

const HospitalStaffViewAllNotifications = () => {
    const navigate = useNavigate(); // Initialize the useNavigate hook
    const [notifications, setNotifications] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString('en-GB');
        const formattedTime = date.toLocaleTimeString('en-US', { hour12: false });
        return `${formattedDate} ${formattedTime}`;
    };

    useEffect(() => {
        const fetchNotifications = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospitalStaff/hospitalStaffViewAllNotifications',
                    { hospitalStaffId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setNotifications(response.data.data);
                }
            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response;
                    switch (status) {
                        case 401:
                        case 403:
                            alert(data.message || 'Unauthorized access. Please login again.');
                            // Redirect to login page
                            break;
                        case 422:
                            alert(data.message || 'No notifications found.');
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

        fetchNotifications();
    }, []);

    const handleViewNotification = (notificationId) => {
        sessionStorage.setItem('notificationId', notificationId); // Store the clicked notification ID in session storage
        navigate('/hospitalStaffViewOneNotification'); // Navigate to the single notification detail page
    };

    return (
<div className="d-flex flex-column min-vh-100" style={{
    background: 'linear-gradient(180deg, #00B4D8 0%, #0077B6 100%)', 
}}>
    <HospitalStaffNavbar />
    <div className="container" style={{ flex: 1 }}>
        <div className="row">
            <div className="col-12" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
                {isLoading ? (
                    <div className="d-flex justify-content-center p-5">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : notifications.length > 0 ? (
                    <ul className="list-group list-group-flush">
                        {notifications.map((notification, index) => (
                            <li
                                key={index}
                                className="list-group-item mb-3 shadow-sm border border-primary"
                                style={{
                                    borderRadius: '1rem',
                                    background: 'white', // Changed to white background
                                    backdropFilter: 'blur(5px)',
                                    cursor: 'pointer'
                                }}
                                onClick={() => handleViewNotification(notification.notificationId)}
                            >
                                <div className="d-flex align-items-center">
                                    {notification.hospitalImage && (
                                        <div style={{ flexShrink: 0 }}>
                                            <div className="rounded-circle border border-primary overflow-hidden" 
                                                style={{ width: '60px', height: '60px' }}>
                                                <img
                                                    src={notification.hospitalImage}
                                                    className="img-fluid"
                                                    alt="Hospital"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className="flex-grow-1" style={{ overflow: 'hidden' }}>
                                        <p className="mb-0 fw-bold" style={{ fontSize: '1rem', color: '#333', wordBreak: 'break-word', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
                                            {notification.message}
                                        </p>
                                        <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>
                                            <span style={{ color: 'red' }}>{formatDate(notification.sendDate)}</span>
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center mt-4">No notifications found.</p>
                )}
            </div>
        </div>
    </div>
    <Footer />
</div>


    );
};

export default HospitalStaffViewAllNotifications;
