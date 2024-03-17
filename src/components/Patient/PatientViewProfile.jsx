import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './PatientNavbar';
import Footer from '../Common/Footer';

const PatientViewProfile = () => {
    const navigate = useNavigate();
    const [patientProfile, setPatientProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const patientId = sessionStorage.getItem('patientId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/patient/patientViewProfile',
                    { patientId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setPatientProfile(response.data.data);
                }
            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response;
                    switch (status) {
                        case 401:
                        case 403:
                            alert(data.message || 'Unauthorized access. Please login again.');
                            navigate('/patientLogin');
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
  <Navbar />
  <div className="container-fluid flex-grow-1 d-flex justify-content-center align-items-center" style={{ paddingTop: '56px', paddingBottom: '80px' }}>
      <div className="col-12 col-md-10 col-lg-8">
          <div className="card shadow-lg mb-5 bg-body rounded" style={{ borderRadius: '15px', overflow: 'hidden' }}>
              {!isLoading && patientProfile ? (
                  <div className="card-body">
                      <div className="row g-4">
                          <div className="col-12 col-md-5 d-flex justify-content-center">
                              <img
                                  src={patientProfile.patientProfileImage}
                                  alt="Patient"
                                  className="img-thumbnail"
                                  style={{ width: '250px', height: '250px', objectFit: 'cover', borderRadius: '50%', border: '5px solid #f8f9fa' }}
                              />
                          </div>
                          <div className="col-12 col-md-7">
                              <p className="mb-2"><strong>Name:</strong> {patientProfile.patientName}</p>
                              <p className="mb-2"><strong>Email:</strong> {patientProfile.patientEmail}</p>
                              <p className="mb-2"><strong>Aadhar:</strong> {patientProfile.patientAadhar}</p>
                              <p className="mb-2"><strong>Mobile:</strong> {patientProfile.patientMobile}</p>
                              <p className="mb-2"><strong>Address:</strong> {patientProfile.patientAddress}</p>
                              <p className="mb-2"><strong>Registered Date:</strong> {formatDate(patientProfile.registeredDate)}</p>
                          </div>
                      </div>
                      <div className="row mt-4">
                          <div className="col d-flex justify-content-center">
                              <button className="btn btn-outline-secondary text-dark" style={{ border: '2px solid #6c757d', color: '#6c757d', fontWeight: 'bold', boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)', padding: '0.375rem 0.75rem', borderRadius: '0.25rem' }}>
                                  <Link to="/patientUpdateProfile" className="text-decoration-none text-dark" style={{ textDecoration: 'none', color: 'inherit' }}>Update Details</Link>
                              </button>
                          </div>
                      </div>
                  </div>
              ) : isLoading ? (
                  <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                      <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading...</span>
                      </div>
                  </div>
              ) : (
                  <div className="card-body d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                      <p>No profile found.</p>
                  </div>
              )}
          </div>
      </div>
  </div>
  <Footer />
</div>



    );
};

export default PatientViewProfile;
