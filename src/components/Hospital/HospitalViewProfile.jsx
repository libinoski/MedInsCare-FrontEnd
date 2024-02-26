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

    return (
        <div>
            <Navbar />
            <div
                className="hospital-view-profile-container bg-image"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    paddingTop: '56px',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <div className="card profile-card" style={{ width: '80%', maxWidth: '600px' }}>
                    {isLoading ? (
                        <div className="card-body text-center">Loading profile...</div>
                    ) : hospitalProfile ? (
                        <div className="card-body">
                            <div className="profile-image-details-container">
                                <div className="profile-image-container" style={{ position: 'relative', overflow: 'hidden', width: '200px', height: '200px', margin: '0 auto' }}>
                                    <img
                                        src={hospitalProfile.hospitalImage}
                                        alt="Hospital"
                                        className="img-fluid profile-image"
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                    />
                                    <Link to="/hospitalUpdateImage" style={{ position: 'absolute', right: '10px', bottom: '10px', color: '#fff' }}>
                                        <FontAwesomeIcon icon={faEdit} className="update-image-icon" />
                                    </Link>
                                </div>
                                <div className="details-container">
                                    <p><strong>Name:</strong> {hospitalProfile.hospitalName}</p>
                                    <p><strong>Email:</strong> {hospitalProfile.hospitalEmail}</p>
                                    <p><strong>Aadhar:</strong> {hospitalProfile.hospitalAadhar}</p>
                                    <p><strong>Mobile:</strong> {hospitalProfile.hospitalMobile}</p>
                                    <p><strong>Website:</strong> {hospitalProfile.hospitalWebSite}</p>
                                    <p><strong>Address:</strong> {hospitalProfile.hospitalAddress}</p>
                                    <p><strong>Registered Date:</strong> {hospitalProfile.registeredDate}</p>
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
