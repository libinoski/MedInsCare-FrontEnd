// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import backgroundImage from '../../images/HospitalStaff/staffs1.svg'; // Import the background image
import Footer from '../Common/Footer';

const HospitalViewOneStaff = () => {
    const navigate = useNavigate();
    const [staffDetails, setStaffDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchStaffDetails = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewOneHospitalStaff',
                    { hospitalId, hospitalStaffId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setStaffDetails(response.data.data);
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
                            const errorMessage422 = data.error || "An error occurred while fetching staff details.";
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchStaffDetails();
    }, [navigate]);

    const handleDeleteStaff = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this staff?");
        if (!confirmed) return;

        try {
            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/deleteHospitalStaff',
                { hospitalId, hospitalStaffId },
                {
                    headers: {
                        token
                    }
                }
            );
            if (response.status === 200) {
                alert(response.data.message);
                navigate('/hospitalViewAllStaffs'); // Redirect to the home page or any other appropriate page
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
                        const errorMessage422 = data.error || "An error occurred while deleting the staff.";
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
        }
    };

    const handleSuspendStaff = async () => {
        const confirmed = window.confirm("Are you sure you want to suspend this staff?");
        if (!confirmed) return;

        try {
            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/suspendHospitalStaff',
                { hospitalId, hospitalStaffId },
                {
                    headers: {
                        token
                    }
                }
            );
            if (response.status === 200) {
                alert(response.data.message);
                navigate('/hospitalViewAllStaffs');
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
                        const errorMessage422 = data.error || "An error occurred while suspending the staff.";
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
        }
    };

    const handleSendNotificationToStaff = () => {
        navigate('/hospitalSendNotificationToStaff');
    };

    return (
<div>
    <Navbar />
    <div className="container-fluid" style={{ paddingTop: '56px', paddingBottom: '80px' }}>
        <div className="row justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
            <div className="col-12">
                {isLoading ? (
                    <p className="text-center">Loading staff details...</p>
                ) : staffDetails ? (
                    <div className="card shadow-lg" style={{ borderRadius: '15px', width: '100%' }}>
                        <div className="card-body row">
                            <div className="col-md-6">
                                <div className="position-relative rounded-circle profile-image-container" style={{ width: '200px', height: '200px', overflow: 'hidden', margin: '0 auto', marginBottom: '20px' }}>
                                    <img
                                        src={staffDetails.hospitalStaffProfileImage}
                                        alt="Profile"
                                        className="img-fluid rounded-circle"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <h5 className="card-title" style={{ color: '#0056b3', fontWeight: 'bold', marginBottom: '10px' }}>{staffDetails.hospitalStaffName}</h5>
                                <p><strong>Email:</strong> {staffDetails.hospitalStaffEmail}</p>
                                <p><strong>Aadhar:</strong> {staffDetails.hospitalStaffAadhar}</p>
                                <p><strong>Mobile:</strong> {staffDetails.hospitalStaffMobile}</p>
                                <p><strong>Address:</strong> {staffDetails.hospitalStaffAddress}</p>
                                <p><strong>Added Date:</strong> {staffDetails.addedDate}</p>
                            </div>
                        </div>
                        <div className="card-footer bg-light text-muted">
                            <div className="d-flex justify-content-center">
                                <button
                                    className="btn mx-2"
                                    onClick={handleDeleteStaff}
                                    style={{ backgroundImage: 'linear-gradient(to right, #ff416c, #ff4b2b)', color: 'white', padding: '10px 20px', margin: '5px' }}>
                                    Delete Staff
                                </button>
                                <button
                                    className="btn mx-2"
                                    onClick={handleSuspendStaff}
                                    style={{ backgroundImage: 'linear-gradient(to right, #FFD200, #F7971E)', color: 'white', padding: '10px 20px', margin: '5px' }}>
                                    Suspend Staff
                                </button>
                                <button
                                    className="btn mx-2"
                                    onClick={handleSendNotificationToStaff}
                                    style={{ backgroundImage: 'linear-gradient(to right, #00B4DB, #0083B0)', color: 'white', padding: '10px 20px', margin: '5px' }}>
                                    Send Notification
                                </button>
                                <button
                                    className="btn mx-2"
                                    onClick={() => navigate('/hospitalUpdateStaff')}
                                    style={{ backgroundImage: 'linear-gradient(to right, #11998e, #38ef7d)', color: 'white', padding: '10px 20px', margin: '5px' }}>
                                    Update Staff
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center">No staff details found.</p>
                )}
            </div>
            <div className="col-12 mt-3">
                {backgroundImage && (
                    <img src={backgroundImage} className="img-fluid" alt="Background" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                )}
            </div>
        </div>
    </div>
    <Footer />
</div>
























































    );
};

export default HospitalViewOneStaff;
