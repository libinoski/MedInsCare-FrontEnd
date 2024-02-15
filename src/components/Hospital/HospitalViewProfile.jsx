import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Navbar from './HospitalNavbar';
import '../../css/Hospital/HospitalViewProfile.css';

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
            <div className="hospital-view-profile-container bg-image">
                <div className="container">
                    <div className="row justify-content-center align-items-center min-vh-100">
                        <div className="col-md-8">
                            <div className="card profile-card">
                                {isLoading ? (
                                    <div className="card-body text-center">Loading profile...</div>
                                ) : hospitalProfile ? (
                                    <div className="card-body">
                                        <div className="profile-image-details-container">
                                            <div className="profile-image-container">
                                                <img
                                                    src={hospitalProfile.hospitalImage}
                                                    alt="Hospital"
                                                    className="img-fluid profile-image"
                                                />
                                                <Link to="/hospitalUpdateImage">
                                                    <FontAwesomeIcon icon={faEdit} className="update-image-icon" />
                                                </Link>
                                            </div>
                                            <div className="details-container">
                                                <p><strong>Hospital ID:</strong> {hospitalProfile.hospitalId}</p>
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
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalViewProfile;
