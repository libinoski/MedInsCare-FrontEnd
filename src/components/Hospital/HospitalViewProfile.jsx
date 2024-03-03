import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

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
    {/* Navbar */}
    <Navbar />
    <div class="container-fluid" style={{ paddingTop: '56px', paddingBottom: '80px' }}>
        <div class="row justify-content-center">
            <div class="col-lg-8 col-md-12">
                <div class="card shadow-sm p-3 mb-5 bg-white rounded">
                    {isLoading ? (
                        <div class="card-body d-flex justify-content-center align-items-center">
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : hospitalProfile ? (
                        <div class="card-body">
                            <div class="row g-3">
                                <div class="col-md-6 d-flex justify-content-center mb-3">
                                    <div class="position-relative">
                                        <img
                                            src={hospitalProfile && hospitalProfile.hospitalImage}
                                            alt="Hospital"
                                            class="img-fluid rounded-circle"
                                            style={{ width: '200px', height: '200px', objectFit: 'cover', border: '4px solid #fff', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)' }}
                                        />
                                    </div>
                                </div>
                                <div class="col-md-6 d-flex flex-column justify-content-center">
                                    <p class="mb-2"><strong>Name:</strong> {hospitalProfile.hospitalName}</p>
                                    <p class="mb-2"><strong>Email:</strong> {hospitalProfile.hospitalEmail}</p>
                                    <p class="mb-2"><strong>Aadhar:</strong> {hospitalProfile.hospitalAadhar}</p>
                                    <p class="mb-2"><strong>Mobile:</strong> {hospitalProfile.hospitalMobile}</p>
                                    <p class="mb-2"><strong>Website:</strong> {hospitalProfile.hospitalWebSite}</p>
                                    <p class="mb-2"><strong>Address:</strong> {hospitalProfile.hospitalAddress}</p>
                                    <p class="mb-2"><strong>Registered Date:</strong> {formatDate(hospitalProfile.registeredDate)}</p>
                                </div>
                            </div>
                            <div class="d-flex justify-content-center mt-4">
                                <Link to="/hospitalUpdateProfile" class="btn" style={{ background: 'linear-gradient(45deg, #007bff, #6610f2)', color: '#fff', padding: '10px 20px', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>Update Details</Link>
                                <Link to="/hospitalChangeImage" class="btn" style={{ background: 'linear-gradient(45deg, #20c997, #198754)', color: '#fff', padding: '10px 20px', marginLeft: '10px', borderRadius: '20px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' }}>Update Image</Link>
                            </div>
                        </div>
                    ) : (
                        <div class="card-body d-flex justify-content-center align-items-center">
                            <p>No profile found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </div>
    {/* Footer */}
    <Footer />
</div>




    
    
          
          
          
          );
          
          
};

export default HospitalViewProfile;
