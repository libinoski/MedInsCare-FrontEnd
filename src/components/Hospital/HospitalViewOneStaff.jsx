// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import backgroundImage from '../../images/HospitalStaff/7475685_3674981.svg'; // Import the background image
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
        <div className="row justify-content-center align-items-center">
            <div className="col-lg-6 d-flex align-items-center justify-content-center">
                {/* Ensure backgroundImage is not null */}
                {backgroundImage && (
                    <img src={backgroundImage} className="img-fluid" alt="Background" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                )}
            </div>
            <div className="col-lg-6 d-flex align-items-center justify-content-center">
                {isLoading ? (
                    <p className="text-center">Loading staff details...</p>
                ) : staffDetails ? (
                    <div className="card shadow-lg" style={{ borderRadius: '15px', maxWidth: '100%' }}>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-md-4">
                                    {/* Ensure hospitalStaffProfileImage is not null */}
                                    {staffDetails.hospitalStaffProfileImage && (
                                        <div className="profile-image-container" style={{ maxWidth: '200px', maxHeight: '200px', overflow: 'hidden' }}>
                                            <img 
                                                src={staffDetails.hospitalStaffProfileImage} 
                                                alt="Profile" 
                                                className="img-fluid" 
                                                // Remove inline styles for profile image
                                            />
                                        </div>
                                    )}
                                </div>
                                <div className="col-md-8">
                                    <h5 className="card-title" style={{ color: '#0056b3', fontWeight: 'bold', marginBottom: '10px' }}>{staffDetails.hospitalStaffName}</h5>
                                    <p><strong style={{ color: '#000' }}>Email:</strong> {staffDetails.hospitalStaffEmail}</p>
                                    <p><strong style={{ color: '#000' }}>Aadhar:</strong> {staffDetails.hospitalStaffAadhar}</p>
                                    <p><strong style={{ color: '#000' }}>Mobile:</strong> {staffDetails.hospitalStaffMobile}</p>
                                    <p><strong style={{ color: '#000' }}>Address:</strong> {staffDetails.hospitalStaffAddress}</p>
                                    <p><strong style={{ color: '#000' }}>Added Date:</strong> {staffDetails.addedDate}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer bg-light text-muted">
                            {/* Ensure hospitalStaffIdProofImage is not null */}
                            {staffDetails.hospitalStaffIdProofImage && (
                                <div className="text-center mb-3">
                                    <img 
                                        src={staffDetails.hospitalStaffIdProofImage} 
                                        alt="ID Proof" 
                                        className="img-fluid" 
                                        // Remove all inline styles for the ID proof image
                                    />
                                </div>
                            )}
                            <div className="row justify-content-center"> {/* Modified to use row */}
                                <div className="col-md-12 text-center"> {/* Center aligning the buttons */}
                                    <button className="btn btn-gradient btn-danger mx-1" onClick={handleDeleteStaff}>Delete Staff</button>
                                    <button className="btn btn-gradient btn-warning mx-1" onClick={handleSuspendStaff}>Suspend Staff</button>
                                    <button className="btn btn-gradient btn-primary mx-1" onClick={handleSendNotificationToStaff}>Send Notification</button>
                                    <button className="btn btn-gradient btn-success mx-1" onClick={() => navigate('/hospitalUpdateStaff')}>Update Staff</button>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-center">No staff details found.</p>
                )}
            </div>
        </div>
    </div>
    <Footer />
</div>

























    );
};

export default HospitalViewOneStaff;
