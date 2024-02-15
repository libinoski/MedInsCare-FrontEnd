import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../../css/Hospital/HospitalViewProfile.css'; // Import CSS for Hospital Login page

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
        <div className="hospital-view-profile-container">
            <div className="container-fluid d-flex align-items-center justify-content-center vh-100 bg-image">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-8">
                        <div className="card profile-card">
                            {isLoading ? (
                                <div className="card-body text-center">Loading profile...</div>
                            ) : hospitalProfile ? (
                                <div className="card-body">
                                    <div className="profile-image-container mb-3 text-center">
                                        <img
                                            src={hospitalProfile.hospitalImage}
                                            alt="Hospital"
                                            className="img-fluid profile-image"
                                            style={{ maxHeight: '300px', objectFit: 'cover' }} // Inline styles for demonstration
                                        />
                                    </div>
                                    <div className="row g-3">
                                        <div className="col-md-6">
                                            <p><strong>Hospital ID:</strong> {hospitalProfile.hospitalId}</p>
                                            <p><strong>Name:</strong> {hospitalProfile.hospitalName}</p>
                                            <p><strong>Email:</strong> {hospitalProfile.hospitalEmail}</p>
                                            <p><strong>Aadhar:</strong> {hospitalProfile.hospitalAadhar}</p>
                                        </div>
                                        <div className="col-md-6">
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
                                <Link to="/hospitalUpdateProfile" className="btn btn-primary">Update Profile</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HospitalViewProfile;
