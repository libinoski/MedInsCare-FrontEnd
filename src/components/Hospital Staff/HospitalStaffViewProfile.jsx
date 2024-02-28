import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/Hospital/doc.jpg';
import HospitalStaffNavbar from './HospitalStaffNavbar';

const HospitalStaffViewProfile = () => {
    const navigate = useNavigate();
    const [staffProfile, setStaffProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospitalStaff/hospitalStaffViewProfile',
                    { hospitalStaffId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setStaffProfile(response.data.data);
                }
            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response;
                    switch (status) {
                        case 401:
                        case 403:
                            alert(data.message || 'Unauthorized access. Please login again.');
                            navigate('/hospitalStaffLogin');
                            break;
                        case 422:
                            const errorMessage422 = data.error || "An error occurred during profile view.";
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

        fetchProfile();
    }, [navigate]);

    // Function to format date and time
    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
        const formattedTime = date.toLocaleTimeString('en-US', { hour12: false }); // Format: HH:MM
        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <div>
            <HospitalStaffNavbar />
            <div
                className="hospital-view-profile-container bg-image"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: 'calc(100vh - 56px - 80px)',
                    paddingTop: '56px',
                    paddingBottom: '80px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div className="card profile-card shadow-lg" style={{ width: '80%', maxWidth: '600px', borderRadius: '15px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.5)', height: '100%', marginBottom: '20px', position: 'relative' }}>
                    <div className="position-absolute top-0 end-0" style={{ marginTop: '10px', marginRight: '10px', zIndex: 1 }}>
                        <div className="dropdown" style={{ position: 'absolute', top: '20px', right: '20px' }}>
                            <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton" data-bs-toggle="dropdown" aria-expanded="false">
                                Actions
                            </button>
                            <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                                <li><Link to="/hospitalStaffChangeProfileImage" className="dropdown-item">Change Profile Image</Link></li>
                                <li><Link to="/hospitalStaffChangeIdProofImage" className="dropdown-item">Change ID Proof Image</Link></li>
                                {staffProfile && (
                                    <li>
                                        {/* Additional action */}
                                    </li>
                                )}
                            </ul>
                        </div>
                    </div>
                    {isLoading ? (
                        <div className="card-body text-center">Loading profile...</div>
                    ) : staffProfile ? (
                        <div className="card-body">
                            <div className="profile-image-details-container text-center mb-4">
                                <div className="profile-image-container mb-3 position-relative d-flex justify-content-center" style={{ zIndex: 0 }}>
                                    <div className="profile-image-frame border border-2 border-primary rounded-circle d-flex align-items-center justify-content-center position-relative" style={{ width: '220px', height: '220px' }}>
                                        <img
                                            src={staffProfile.hospitalStaffProfileImage}
                                            alt="Staff"
                                            className="img-fluid rounded-circle profile-image"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                        />
                                    </div>
                                </div>
                                <div className="details-container text-start">
                                    <h2 className="profile-name">{staffProfile.hospitalStaffName}</h2>
                                    <p className="profile-info"><strong>Email:</strong> {staffProfile.hospitalStaffEmail}</p>
                                    <p className="profile-info"><strong>Aadhar:</strong> {staffProfile.hospitalStaffAadhar}</p>
                                    <p className="profile-info"><strong>Mobile:</strong> {staffProfile.hospitalStaffMobile}</p>
                                    <p className="profile-info"><strong>Address:</strong> {staffProfile.hospitalStaffAddress}</p>
                                    <p className="profile-info"><strong>Registered Date:</strong> {formatDate(staffProfile.addedDate)}</p>
                                    <p className="profile-info"><strong>Last Updated:</strong> {formatDate(staffProfile.updatedDate)}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card-body text-center">No profile found.</div>
                    )}
                    <div className="card-footer text-end">
                        <Link to="/hospitalStaffUpdateProfile" className="btn btn-primary">Update details</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HospitalStaffViewProfile;
