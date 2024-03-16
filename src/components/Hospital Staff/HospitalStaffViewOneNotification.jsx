import React, { useState, useEffect } from 'react';
import axios from 'axios';
import HospitalStaffNavbar from './HospitalStaffNavbar';
import Footer from '../Common/Footer';

const HospitalStaffViewOneNotification = () => {
    const [notification, setNotification] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchNotification = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
                const notificationId = sessionStorage.getItem('notificationId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospitalStaff/hospitalStaffViewOneNotification',
                    { hospitalStaffId, notificationId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setNotification(response.data.data);
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
                            alert(data.message || 'Notification not found.');
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

        fetchNotification();
    }, []);

    return (
<div className="d-flex flex-column min-vh-100" style={{
    background: 'linear-gradient(180deg, #00B4D8 0%, #0077B6 100%)', 
}}>    <HospitalStaffNavbar />
    <div style={{ paddingTop: '60px', paddingBottom: '60px' }}>
        <div className="container">
            {isLoading ? (
                <div className="d-flex justify-content-center mt-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            ) : notification ? (
                <div className="card mb-3 shadow-sm border-primary">
                    <div className="card-body">
                        <h5 className="card-title fw-bold text-primary mb-3">Notification Details:</h5>
                        <p className="card-text mb-0">{notification.message}</p>
                        <p className="card-text mt-2">
                            <small className="text-muted">Date: {new Date(notification.sendDate).toLocaleString()}</small>
                        </p>
                    </div>
                </div>
            ) : (
                <p className="text-center mt-4">No notification found.</p>
            )}
        </div>
    </div>
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
        <Footer />
    </div>
</div>



    );
};

export default HospitalStaffViewOneNotification;
