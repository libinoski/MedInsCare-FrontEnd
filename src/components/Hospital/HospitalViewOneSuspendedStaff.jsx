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
        <div className="row justify-content-center align-items-center" style={{ height: '100vh' }}>
            <div className="col-lg-6 d-flex align-items-center justify-content-center">
                {isLoading ? (
                    <p className="text-center">Loading staff details...</p>
                ) : (
                    <div className="card shadow border border-danger" style={{ borderRadius: '15px', width: '100%' }}>
                        <div className="card-body">
                            <div className="row align-items-start justify-content-start"> {/* Align items and justify content to start */}
                                <div className="col-md-4 text-center">
                                    <img src={staffDetails.hospitalStaffProfileImage} alt="Staff Profile" className="img-fluid" style={{ width: '200px', height: '200px', objectFit: 'cover' }} />
                                </div>
                                <div className="col-md-8"> {/* Move the name and email to the left */}
                                    <h5 className="card-title">{staffDetails.hospitalStaffName}</h5>
                                    <p><strong>Email:</strong> {staffDetails.hospitalStaffEmail}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer bg-transparent border-0" style={{ position: 'absolute', bottom: '0', right: '0' }}> {/* Align button to bottom right */}
                            <button className="btn btn-success btn-lg" onClick={handleUnsuspendStaff} style={{ borderRadius: '10px', backgroundImage: 'linear-gradient(to right, #00cc99, #006600)' }}>Unsuspend</button>
                        </div>
                    </div>
                )}
            </div>
            <div className="col-lg-6 d-flex align-items-center justify-content-center">
                {/* Ensure backgroundImage is not null */}
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

export default HospitalViewOneSuspendedStaff;
