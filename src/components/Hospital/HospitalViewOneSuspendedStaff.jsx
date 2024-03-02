import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/Hospital/hr.jpg'; // Import the background image

const HospitalViewOneSuspendedStaff = () => {
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
                    'http://localhost:1313/api/mic/hospital/viewOneSuspendedHospitalStaff',
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
                            alert(data.error || 'Hospital staff not found.');
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

    const handleUnsuspendStaff = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/unSuspendHospitalStaff',
                { hospitalId, hospitalStaffId },
                {
                    headers: {
                        token
                    }
                }
            );
            if (response.status === 200) {
                alert('Hospital staff unsuspended successfully.');
                // Redirect to a suitable page after unsuspension
                navigate('/hospitalViewAllSuspendedStaffs');
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
                        alert(data.error || 'Hospital staff not found.');
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
                ) : (
                    <div className="container">
                        <div className="row justify-content-center">
                            <div className="col-lg-8"> {/* Adjusted column size */}
                                {staffDetails ? (
                                    <div className="card" style={{ borderRadius: '10px', padding: '20px', width: '100%' }}> {/* Adjusted width */}
                                        <div className="card-body">
                                            <img src={staffDetails.hospitalStaffProfileImage} alt="Staff Profile" style={{ width: '100%', borderRadius: '10px', marginBottom: '10px', maxHeight: '300px', objectFit: 'contain' }} /> {/* Adjusted height */}
                                            <h5 className="card-title">{staffDetails.hospitalStaffName}</h5>
                                            <p><strong>Email:</strong> {staffDetails.hospitalStaffEmail}</p>
                                            <p><strong>Aadhar:</strong> {staffDetails.hospitalStaffAadhar}</p>
                                            <p><strong>Mobile:</strong> {staffDetails.hospitalStaffMobile}</p>
                                            <p><strong>Address:</strong> {staffDetails.hospitalStaffAddress}</p>
                                            <p><strong>Added Date:</strong> {staffDetails.addedDate}</p>
                                        </div>
                                        <div className="card-footer">
                                            <button className="btn btn-success" onClick={handleUnsuspendStaff}>Unsuspend</button>
                                        </div>
                                    </div>
                                ) : (
                                    <p className="text-center">No staff details found.</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
    <Footer />
</div>





    );
};

export default HospitalViewOneSuspendedStaff;
