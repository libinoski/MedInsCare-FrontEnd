import React, { useState } from 'react';
import axios from 'axios';
import Footer from '../Common/Footer';
import { useNavigate } from 'react-router-dom';
import HospitalNavbar from './HospitalNavbar';

const HospitalSendNotificationToStaff = () => {
    const [notificationMessage, setNotificationMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate(); // Initialize useNavigate hook

    const handleSubmit = async (event) => {
        event.preventDefault();

        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/sendNotificationToStaff',
                { hospitalId, hospitalStaffId, notificationMessage },
                {
                    headers: {
                        'token': token,
                        'Content-Type': 'application/json'
                    },
                }
            );
            if (response.status === 200) {
                // alert(response.data.message);
                navigate('/hospitalViewOneStaff', { state: { hospitalStaffId } }); // Navigate to the view one staff page with state
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


    <HospitalNavbar />
    <div className="container-fluid" style={{ position: 'relative',  paddingTop: '56px', flex: '1' }}>
        <div className="container py-5">
            <div className="row d-flex justify-content-center align-items-center">
                <div className="col-lg-6">
                    <div className="card border-0" style={{ boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', borderRadius: '15px', maxWidth: '100%' }}>
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
                                <div className="text-center mt-4"> {/* Center the button */}
                                    <button
                                        type="submit"
                                        className="btn btn-outline-secondary text-dark d-flex justify-content-center align-items-center"
                                        disabled={isLoading}
                                        style={{
                                            border: '2px solid #6c757d',
                                            color: '#6c757d',
                                            fontWeight: 'bold',
                                            boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
                                            padding: '10px 20px',
                                            borderRadius: '25px',
                                            width: '100%',
                                            maxWidth: '200px', // Adjust based on your preference
                                            textDecoration: 'none',
                                            transition: 'background-color .3s', // Maintaining the transition effect for stylistic consistency
                                            margin: '0 auto' // Center horizontally
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
    <Footer />
</div>



    );
};

export default HospitalSendNotificationToStaff;
