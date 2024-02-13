import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
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
        <div className="hospital-profile-container">
            {isLoading && <p>Loading profile...</p>}
            {hospitalProfile && (
                <div className="hospital-profile-card">
                    <h2>Hospital Profile</h2>
                    <p>Hospital ID: {hospitalProfile.hospitalId}</p>
                    <p>Name: {hospitalProfile.hospitalName}</p>
                    <p>Image: {hospitalProfile.hospitalImage}</p>
                    <p>Email: {hospitalProfile.hospitalEmail}</p>
                    <p>Aadhar: {hospitalProfile.hospitalAadhar}</p>
                    <p>Mobile: {hospitalProfile.hospitalMobile}</p>
                    <p>Website: {hospitalProfile.hospitalWebSite}</p>
                    <p>Address: {hospitalProfile.hospitalAddress}</p>
                    <p>Registered Date: {hospitalProfile.registeredDate}</p>
                    <div className="buttons">
                        <Link to="/hospitalUpdateProfile">
                            <button className="btn-update">Update Profile</button>
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HospitalViewProfile;
