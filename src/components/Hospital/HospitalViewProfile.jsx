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

  {/* Main Content */}
  <div className="d-flex flex-grow-1 align-items-center justify-content-center" style={{ padding: '56px 0 80px' }}>
    <div className="card shadow-lg bg-body rounded" style={{ maxWidth: '100%', width: '60%', borderRadius: '15px' }}>
      <div className="card-body">
        {isLoading ? (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : hospitalProfile ? (
          <div className="row">
            <div className="col-md-5 d-flex justify-content-center align-items-center">
              <img
                src={hospitalProfile && hospitalProfile.hospitalImage}
                alt="Hospital"
                className="img-thumbnail"
                style={{ width: '250px', height: '250px', objectFit: 'cover', borderRadius: '50%', border: '5px solid #f8f9fa' }}
              />
            </div>
            <div className="col-md-7">
              <h2 className="profile-name">{hospitalProfile.hospitalName}</h2>
              <p><strong>Email:</strong> {hospitalProfile.hospitalEmail}</p>
              <p><strong>Aadhar:</strong> {hospitalProfile.hospitalAadhar}</p>
              <p><strong>Mobile:</strong> {hospitalProfile.hospitalMobile}</p>
              <p><strong>Website:</strong> <a href={hospitalProfile.hospitalWebSite} className="text-decoration-none">{hospitalProfile.hospitalWebSite}</a></p>
              <p><strong>Address:</strong> {hospitalProfile.hospitalAddress}</p>
              <p><strong>Registered Date:</strong> {formatDate(hospitalProfile.registeredDate)}</p>
            </div>
          </div>
        ) : (
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
            <p>No profile found.</p>
          </div>
        )}
      </div>
      {hospitalProfile && (
        <div className="card-body d-flex justify-content-center gap-3">
          <Link to="/hospitalUpdateProfile" className="text-decoration-none">
            <button
              className="btn btn-outline-secondary text-dark d-flex justify-content-center align-items-center"
              style={{
                border: '2px solid #6c757d',
                color: '#6c757d',
                fontWeight: 'bold',
                boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
                padding: '10px 20px',
                borderRadius: '25px',
                width: '100%',
                maxWidth: '200px',
              }}
            >
              Update Details
            </button>
          </Link>
          <Link to="/hospitalChangeImage" className="text-decoration-none">
            <button
              className="btn btn-outline-secondary text-dark d-flex justify-content-center align-items-center"
              style={{
                border: '2px solid #6c757d',
                color: '#6c757d',
                fontWeight: 'bold',
                boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
                padding: '10px 20px',
                borderRadius: '25px',
                width: '100%',
                maxWidth: '200px',
              }}
            >
              Change Image
            </button>
          </Link>
        </div>
      )}
    </div>
  </div>

  {/* Footer */}
  <Footer />
</div>

          );
          
          
};

export default HospitalViewProfile;
