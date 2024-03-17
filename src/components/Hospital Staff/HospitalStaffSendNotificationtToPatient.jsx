import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../Common/Footer';
import { useNavigate } from 'react-router-dom';
import HospitalStaffNavbar from './HospitalStaffNavbar';

const HospitalStaffSendNotificationToPatient = () => {
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleSubmit = async (event) => {
        event.preventDefault();
        const confirmed = window.confirm("Are you sure you want to send this notification to the patient?");
        if (!confirmed) return;

        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
            const patientId = sessionStorage.getItem('patientId');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospitalStaff/hospitalStaffSendNotificationPatient',
                { hospitalStaffId, patientId, notificationMessage },
                {
                    headers: {
                        'token': token,
                        'Content-Type': 'application/json'
                    },
                }
            );
            if (response.status === 200) {
                // alert(response.data.message);
                navigate('/hospitalStaffViewOnePatient', { state: { patientId } });
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        setError(data.message || 'Validation failed.');
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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    {/* Navbar */}
    <HospitalStaffNavbar />
    
    <div className="container-fluid" style={{ paddingTop: '56px', flex: '1' }}>
        <div className="container py-5">
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-lg-6">
                    <div className="card bg-transparent border-0" style={{ backdropFilter: 'blur(10px)', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', borderRadius: '15px', maxWidth: '100%' }}>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} noValidate style={{ width: '100%' }}>
                                <div className="mb-4">
                                    <label htmlFor="notificationMessage" className="form-label" style={{ fontWeight: '500' }}>Message:</label>
                                    <textarea
                                        value={notificationMessage}
                                        onChange={(e) => setNotificationMessage(e.target.value)}
                                        className="form-control"
                                        id="notificationMessage"
                                        rows="5"
                                        style={{ borderRadius: '15px', boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)' }}
                                    ></textarea>
                                </div>
                                {error && <div className="alert alert-danger" style={{ borderRadius: '15px' }}>{error}</div>}
                                <div className="text-center">
    <button 
        type="submit" 
        className={`btn mx-2 btn-outline-secondary text-dark ${isLoading ? 'btn-secondary' : ''}`} 
        disabled={isLoading} 
        style={{
            border: '2px solid #6c757d',
            color: '#6c757d',
            fontWeight: 'bold',
            padding: '10px 20px', // Adjusted for consistency
            borderRadius: '25px',
            transition: 'background-color .3s',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            width: 'auto'
        }}
    >
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

export default HospitalStaffSendNotificationToPatient;
