import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
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
<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
  <HospitalStaffNavbar />
  <div className="d-flex flex-column flex-grow-1" style={{ padding: '2rem 0', background: 'linear-gradient(180deg, #00B4D8 0%, #0077B6 100%)' }}>
    <div className="container d-flex justify-content-center align-items-center flex-grow-1">
      {isLoading ? (
        <div className="card-body text-center">Loading profile...</div>
      ) : staffProfile ? (
        <div className="card profile-card shadow-lg" style={{ width: '100%', maxWidth: '600px', borderRadius: '15px', backdropFilter: 'blur(10px)', backgroundColor: '#ffffff', margin: 'auto' }}>
          <div className="card-body">
            {/* Profile Image and Details */}
            <div className="profile-image-details-container text-center mb-4">
              <div className="profile-image-container mb-3 position-relative d-flex justify-content-center" style={{ zIndex: 0 }}>
                <div className="profile-image-frame border border-2 border-primary rounded-circle d-flex align-items-center justify-content-center position-relative" style={{ width: '220px', height: '220px' }}>
                  <img
                    src={staffProfile.hospitalStaffProfileImage}
                    alt="Staff Profile"
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
              </div>
            </div>
          </div>
          <div className="card-footer text-center">
            <div style={{ display: 'flex', justifyContent: 'center', gap: '20px' }}>
              {/* Buttons for actions */}
              <button className="btn btn-outline-secondary text-dark" style={{
                  border: '2px solid #6c757d',
                  color: '#6c757d',
                  fontWeight: 'bold',
                  boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
              }}>
                <Link to="/hospitalStaffChangeProfileImage" className="text-decoration-none text-dark">Change Profile Image</Link>
              </button>
              <button className="btn btn-outline-secondary text-dark" style={{
                  border: '2px solid #6c757d',
                  color: '#6c757d',
                  fontWeight: 'bold',
                  boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
              }}>
                <Link to="/hospitalStaffChangeIdProofImage" className="text-decoration-none text-dark">Change ID Proof Image</Link>
              </button>
              <button className="btn btn-outline-secondary text-dark" style={{
                  border: '2px solid #6c757d',
                  color: '#6c757d',
                  fontWeight: 'bold',
                  boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
              }}>
                <Link to="/hospitalStaffUpdateProfile" className="text-decoration-none text-dark">Update Details</Link>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="card-body text-center">No profile found.</div>
      )}
    </div>
  </div>
  <Footer />
</div>

    );
};

export default HospitalStaffViewProfile;
