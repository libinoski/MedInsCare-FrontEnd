import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/Hospital/doc.jpg'; // Import the background image

const HospitalViewProfile = () => {
    const navigate = useNavigate();
    const [hospitalProfile, setHospitalProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/hospitalViewProfile',
                    { hospitalId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setHospitalProfile(response.data.data);
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
            <Navbar />
            <div
                className="hospital-view-profile-container bg-image"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: 'calc(100vh - 56px)', // Adjusted for the navbar height
                    paddingTop: '56px',
                    paddingBottom: '80px', // Adjusted for the footer height
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div className="card profile-card shadow-lg" style={{ width: '80%', maxWidth: '600px', borderRadius: '15px', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.5)', height: '100%', marginBottom: '20px' }}>
                    {isLoading ? (
                        <div className="card-body text-center">Loading profile...</div>
                    ) : hospitalProfile ? (
                        <div className="card-body">
                            <div className="profile-image-details-container text-center mb-4">
                                <div className="profile-image-container mb-3 position-relative">
                                    <div className="profile-image-frame border border-2 border-primary rounded-circle d-flex align-items-center justify-content-center position-relative" style={{ width: '220px', height: '220px' }}>
                                        <img
                                            src={hospitalProfile.hospitalImage}
                                            alt="Hospital"
                                            className="img-fluid rounded-circle profile-image"
                                            style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                                        />
                                        <Link to="/hospitalChangeImage" className="edit-image-link position-absolute" style={{ bottom: '10px', right: '10px', zIndex: '2', color: '#000' }}>
                                            <FontAwesomeIcon icon={faEdit} className="update-image-icon" />
                                        </Link>
                                    </div>
                                </div>
                                <div className="details-container text-start">
                                    <p className="profile-info"><strong>Name:</strong> {hospitalProfile.hospitalName}</p>
                                    <p className="profile-info"><strong>Email:</strong> {hospitalProfile.hospitalEmail}</p>
                                    <p className="profile-info"><strong>Aadhar:</strong> {hospitalProfile.hospitalAadhar}</p>
                                    <p className="profile-info"><strong>Mobile:</strong> {hospitalProfile.hospitalMobile}</p>
                                    <p className="profile-info"><strong>Website:</strong> {hospitalProfile.hospitalWebSite}</p>
                                    <p className="profile-info"><strong>Address:</strong> {hospitalProfile.hospitalAddress}</p>
                                    <p className="profile-info"><strong>Registered Date:</strong> {formatDate(hospitalProfile.registeredDate)}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="card-body text-center">No profile found.</div>
                    )}
                    <div className="card-footer text-end">
                        <Link to="/hospitalUpdateProfile" className="btn btn-primary">Update details</Link>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HospitalViewProfile;
