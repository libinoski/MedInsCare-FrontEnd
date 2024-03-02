import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/Hospital/hr.jpg'; // Import the background image

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
        className="hospital-view-profile-container bg-image d-flex align-items-center position-relative"
        style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            minHeight: 'calc(100vh - 56px)', // Adjusted for the navbar height
            paddingTop: '56px',
            paddingBottom: '80px', // Adjusted for the footer height
        }}
    >
        <div className="container" style={{ paddingLeft: '15px', paddingRight: '15px' }}>
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card profile-card-wrapper">
                        <div className="profile-card shadow-lg">
                            {isLoading ? (
                                <div className="card-body text-center">Loading profile...</div>
                            ) : hospitalProfile ? (
                                <div className="card-body text-start">
                                    <div className="profile-image-details-container mb-2">
                                        <div className="profile-image-container mb-1 position-relative">
                                            <div className="position-relative">
                                                <img
                                                    src={hospitalProfile.hospitalImage}
                                                    alt="Hospital"
                                                    className="img-fluid profile-image rounded"
                                                    style={{ width: '100%', height: 'auto', borderRadius: '15px' }}
                                                />
                                                <div className="position-absolute bottom-0 end-0 m-2">
                                                    <Link to="/hospitalChangeImage" className="edit-image-link text-white" style={{ color: '#fff' }}>
                                                        <FontAwesomeIcon icon={faEdit} className="update-image-icon" />
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="details-container">
                                        <p className="profile-info"><strong>Name:</strong> {hospitalProfile.hospitalName}</p>
                                        <p className="profile-info"><strong>Email:</strong> {hospitalProfile.hospitalEmail}</p>
                                        <p className="profile-info"><strong>Aadhar:</strong> {hospitalProfile.hospitalAadhar}</p>
                                        <p className="profile-info"><strong>Mobile:</strong> {hospitalProfile.hospitalMobile}</p>
                                        <p className="profile-info"><strong>Website:</strong> {hospitalProfile.hospitalWebSite}</p>
                                        <p className="profile-info"><strong>Address:</strong> {hospitalProfile.hospitalAddress}</p>
                                        <p className="profile-info"><strong>Registered Date:</strong> {formatDate(hospitalProfile.registeredDate)}</p>
                                    </div>
                                    <div className="d-none d-lg-block position-absolute bottom-0 end-0 m-3">
                                        <Link to="/hospitalUpdateProfile" className="btn btn-primary">Update details</Link>
                                    </div>
                                </div>
                            ) : (
                                <div className="card-body text-center">No profile found.</div>
                            )}
                        </div>
                        <div className="d-lg-none text-end p-3">
                            <Link to="/hospitalUpdateProfile" className="btn btn-primary">Update details</Link>
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

export default HospitalViewProfile;
