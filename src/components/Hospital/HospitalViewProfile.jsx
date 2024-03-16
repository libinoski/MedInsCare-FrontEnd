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
<div className="d-flex flex-column min-vh-100">
    {/* Navbar */}
    <Navbar />
    <div class="container d-flex justify-content-center" style={{ paddingTop: '56px', paddingBottom: '80px' }}>
        <div class="col-12 col-md-10 col-lg-8">
            <div class="card shadow-lg mb-5 bg-body rounded" style={{ borderRadius: '15px', overflow: 'hidden' }}>
                <div class="card-body">
                    {isLoading ? (
                        <div class="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                            <div class="spinner-border text-primary" role="status">
                                <span class="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : hospitalProfile ? (
                        <div class="row g-4 align-items-center">
                            <div class="col-12 col-md-5 d-flex justify-content-center">
                                <img
                                    src={hospitalProfile && hospitalProfile.hospitalImage}
                                    alt="Hospital"
                                    class="img-thumbnail"
                                    style={{ width: '250px', height: '250px', objectFit: 'cover', borderRadius: '50%', border: '5px solid #f8f9fa' }}
                                />
                            </div>
                            <div class="col-12 col-md-7">
                            <h2 className="profile-name">{hospitalProfile.hospitalName}</h2>
                                <p class="mb-2"><strong>Email:</strong> {hospitalProfile.hospitalEmail}</p>
                                <p class="mb-2"><strong>Aadhar:</strong> {hospitalProfile.hospitalAadhar}</p>
                                <p class="mb-2"><strong>Mobile:</strong> {hospitalProfile.hospitalMobile}</p>
                                <p class="mb-2"><strong>Website:</strong> <a href={hospitalProfile.hospitalWebSite} class="text-decoration-none">{hospitalProfile.hospitalWebSite}</a></p>
                                <p class="mb-2"><strong>Address:</strong> {hospitalProfile.hospitalAddress}</p>
                                <p class="mb-2"><strong>Registered Date:</strong> {formatDate(hospitalProfile.registeredDate)}</p>
                            </div>
                        </div>
                    ) : (
                        <div class="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                            <p>No profile found.</p>
                        </div>
                    )}
                    <div class="d-flex justify-content-center gap-3 mt-4">
                        <button
                            class="btn btn-outline-secondary text-dark"
                            style={{
                                border: '2px solid #6c757d',
                                color: '#6c757d',
                                fontWeight: 'bold',
                                boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
                                padding: '10px 20px',
                                borderRadius: '25px'
                            }}
                        >
                            <Link to="/hospitalUpdateProfile" class="text-decoration-none text-dark" style={{ textDecoration: 'none', color: 'inherit' }}>Update Details</Link>
                        </button>
                        <button
                            class="btn btn-outline-secondary text-dark"
                            style={{
                                border: '2px solid #6c757d',
                                color: '#6c757d',
                                fontWeight: 'bold',
                                boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
                                padding: '10px 20px',
                                borderRadius: '25px'
                            }}
                        >
                            <Link to="/hospitalChangeImage" class="text-decoration-none text-dark" style={{ textDecoration: 'none', color: 'inherit' }}>Change Image</Link>
                        </button>
                    </div>
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
