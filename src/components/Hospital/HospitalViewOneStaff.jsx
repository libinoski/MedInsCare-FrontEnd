import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import backgroundImage from '../../images/Hospital/doc.jpg'; // Import the background image
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
                alert('Staff deleted successfully.');
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
                alert('Staff suspended successfully.');
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
            <div className="container-fluid py-5" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="container" style={{ maxWidth: '100%', padding: '0 15px', overflowY: 'auto', maxHeight: '100%' }}>
                    {isLoading ? (
                        <p className="text-center">Loading staff details...</p>
                    ) : (
                        <div className="row justify-content-start">
                            <div className="col-lg-6">
                                {staffDetails ? (
                                    <div className="card" style={{ borderRadius: '10px', padding: '20px', position: 'relative' }}>
                                        <div className="dropdown" style={{ position: 'absolute', top: '20px', right: '20px' }}>
                                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                                Actions
                                            </button>
                                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                                <li><button className="dropdown-item" onClick={handleDeleteStaff}>Delete Staff</button></li>
                                                <li><button className="dropdown-item" onClick={handleSuspendStaff}>Suspend Staff</button></li>
                                                <li><button className="dropdown-item" onClick={handleSendNotificationToStaff}>Send Notification</button></li>
                                                <li><button className="dropdown-item" onClick={() => navigate('/hospitalUpdateStaff')}>Update Staff</button></li>
                                            </ul>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-4">
                                                    <img src={staffDetails.hospitalStaffProfileImage} alt="Profile" className="img-fluid" style={{ maxWidth: '100%' }} />
                                                </div>
                                                <div className="col-md-8">
                                                    <h5 className="card-title">{staffDetails.hospitalStaffName}</h5>
                                                    <p><strong>Email:</strong> {staffDetails.hospitalStaffEmail}</p>
                                                    <p><strong>Aadhar:</strong> {staffDetails.hospitalStaffAadhar}</p>
                                                    <p><strong>Mobile:</strong> {staffDetails.hospitalStaffMobile}</p>
                                                    <p><strong>Address:</strong> {staffDetails.hospitalStaffAddress}</p>
                                                    <p><strong>Added Date:</strong> {staffDetails.addedDate}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-footer">
                                            <img src={staffDetails.hospitalStaffIdProofImage} alt="ID Proof" className="img-fluid" style={{ maxWidth: '100%' }} />
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-center">No staff details found.</p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HospitalViewOneStaff;
