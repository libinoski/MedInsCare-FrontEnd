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
    {/* Navbar */}
    <Navbar />
    <div className="container-fluid" style={{ paddingTop: '56px', paddingBottom: '80px' }}>
        <div className="row">

            {/* Left Side Image Container */}
            <div className="col-lg-6 d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
                <img src={backgroundImage} className="img-fluid" alt="Background" style={{ maxHeight: '100%', maxWidth: '100%' }} />
            </div>

            {/* Right Side Profile Details Card */}
            <div className="col-lg-6 d-flex align-items-center justify-content-center">
                <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '600px' }}>
                    {isLoading ? (
                        <div className="card-body text-center">Loading profile...</div>
                    ) : hospitalProfile ? (
                        <div className="card-body">
                            {/* Profile Image with Edit Icon */}
                            <div className="text-center mb-4">
                            <div className="position-relative d-inline-block">
    <img
        src={hospitalProfile && hospitalProfile.hospitalImage}
        alt="Hospital"
        className="img-fluid"
        style={{
            maxWidth: '300px', // Increased image size
            maxHeight: '300px',
            objectFit: 'contain',
            border: '3px solid white',
            boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
        }}
    />
    {/* Positioned inside the bottom-right of the image */}
    <Link to="/hospitalChangeImage" className="position-absolute" style={{ 
            bottom: '10px', // positions the icon inside the image at the bottom
            right: '10px', // positions the icon inside the image at the right
            backgroundColor: 'rgba(0, 0, 0, 0.6)', // dark semi-transparent background
            borderRadius: '50%', // circular background
            padding: '0.25rem', // padding inside the link
        }}>
        <FontAwesomeIcon 
            icon={faEdit} 
            className="text-white" 
            style={{ 
                fontSize: '1.25rem', // adjust as needed for icon size
                boxShadow: '0 2px 4px rgba(0,0,0,0.75)',
            }} 
        />
    </Link>
</div>

                            </div>
                            {/* Profile Details */}
                            <p className="mb-2"><strong>Name:</strong> {hospitalProfile.hospitalName}</p>
                            <p className="mb-2"><strong>Email:</strong> {hospitalProfile.hospitalEmail}</p>
                            <p className="mb-2"><strong>Aadhar:</strong> {hospitalProfile.hospitalAadhar}</p>
                            <p className="mb-2"><strong>Mobile:</strong> {hospitalProfile.hospitalMobile}</p>
                            <p className="mb-2"><strong>Website:</strong> {hospitalProfile.hospitalWebSite}</p>
                            <p className="mb-2"><strong>Address:</strong> {hospitalProfile.hospitalAddress}</p>
                            <p className="mb-2"><strong>Registered Date:</strong> {formatDate(hospitalProfile.registeredDate)}</p>
                            <div className="text-center mt-4">
                                <Link to="/hospitalUpdateProfile" className="btn btn-primary">Update details</Link>
                            </div>
                        </div>
                    ) : (
                        <div className="card-body text-center">No profile found.</div>
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
