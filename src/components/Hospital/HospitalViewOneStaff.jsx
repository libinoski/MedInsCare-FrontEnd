// eslint-disable-next-line
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
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
<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <div className="container-fluid py-5" style={{ backgroundColor: '#f0f4f7', flex: '1' }}>
        <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
                {isLoading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading staff details...</span>
                        </div>
                    </div>
                ) : staffDetails ? (
                    <div className="card shadow" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                        <div className="card-body p-4 p-md-5">
                            <div className="row align-items-center">
                                <div className="col-md-6 text-center mb-4 mb-md-0">
                                    <img
                                        src={staffDetails.hospitalStaffProfileImage}
                                        alt="Profile"
                                        className="img-fluid rounded-circle border"
                                        style={{ width: '200px', height: '200px', objectFit: 'cover', border: '5px solid #ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                                    />
                                </div>
                                <div className="col-md-6">
                                    <h2 className="card-title" style={{ color: '#0056b3' }}>{staffDetails.hospitalStaffName}</h2>
                                    <p className="mb-2"><strong>Email:</strong> {staffDetails.hospitalStaffEmail}</p>
                                    <p className="mb-2"><strong>Aadhar:</strong> {staffDetails.hospitalStaffAadhar}</p>
                                    <p className="mb-2"><strong>Mobile:</strong> {staffDetails.hospitalStaffMobile}</p>
                                    <p className="mb-2"><strong>Address:</strong> {staffDetails.hospitalStaffAddress}</p>
                                    <p><strong>Added Date:</strong> {staffDetails.addedDate}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer text-muted" style={{ backgroundColor: '#eaeff3', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                            <img
                                src={staffDetails.hospitalStaffIdProofImage}
                                alt="ID Proof"
                                className="img-fluid"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: '200px',  // Set maximum height here
                                    objectFit: 'contain', // This will ensure the image scales properly within the constraints
                                    marginBottom: '20px' // Add margin bottom for distance from buttons
                                }}
                            />
                            <div className="d-flex flex-wrap justify-content-center gap-2 gap-md-3">
                                <button className="btn" onClick={handleDeleteStaff} style={{ backgroundImage: 'linear-gradient(135deg, #ff416c, #ff4b2b)', color: 'white' }}>Delete Staff</button>
                                <button className="btn" onClick={handleSuspendStaff} style={{ backgroundImage: 'linear-gradient(135deg, #FFD200, #F7971E)', color: 'white' }}>Suspend Staff</button>
                                <button className="btn" onClick={handleSendNotificationToStaff} style={{ backgroundImage: 'linear-gradient(135deg, #00B4DB, #0083B0)', color: 'white' }}>Send Notification</button>
                                <button className="btn" onClick={() => navigate('/hospitalUpdateStaff')} style={{ backgroundImage: 'linear-gradient(135deg, #11998e, #38ef7d)', color: 'white' }}>Update Staff</button>
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
