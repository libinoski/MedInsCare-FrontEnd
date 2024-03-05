import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

const HospitalViewOneSuspendedStaff = () => {
    const navigate = useNavigate();
    const [staffDetails, setStaffDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchStaffDetails = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewOneSuspendedHospitalStaff',
                    { hospitalId, hospitalStaffId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setStaffDetails(response.data.data);
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
                            alert(data.error || 'Hospital staff not found.');
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

        fetchStaffDetails();
    }, [navigate]);

    const handleUnsuspendStaff = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/unSuspendHospitalStaff',
                { hospitalId, hospitalStaffId },
                {
                    headers: {
                        token
                    }
                }
            );
            if (response.status === 200) {
                alert('Hospital staff unsuspended successfully.');
                // Redirect to a suitable page after unsuspension
                navigate('/hospitalViewAllSuspendedStaffs');
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
                        alert(data.error || 'Hospital staff not found.');
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
        }
    };

    return (
<div>
  <Navbar />
  <div className="container-fluid py-5" style={{ paddingTop: '56px', paddingBottom: '80px', backgroundColor: '#f0f2f5' }}>
    <div className="row justify-content-center align-items-center">
      <div className="col-lg-8 d-flex align-items-center justify-content-center">
        {isLoading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading staff details...</span>
            </div>
          </div>
        ) : (
          <div className="col-lg-12">
            {staffDetails ? (
              <div className="card profile-card shadow border-0 w-100 h-100" style={{ borderRadius: '20px' }}>
                <div className="card-body">
                  <div className="d-flex flex-column align-items-center mb-5">
                    <div className="profile-picture bg-light rounded-circle shadow" style={{ width: '200px', height: '200px', overflow: 'hidden', border: '5px solid white' }}>
                      <img src={staffDetails.hospitalStaffProfileImage} alt="Staff" className="img-fluid" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                    </div>
                    <h3 className="mt-4 text-center">{staffDetails.hospitalStaffName}</h3>
                  </div>
                  <div className="text-left">
                    <p className="mb-2"><strong>Email:</strong> {staffDetails.hospitalStaffEmail}</p>
                    <p className="mb-2"><strong>Mobile:</strong> {staffDetails.hospitalStaffMobile}</p>
                    <p className="mb-2"><strong>Address:</strong> {staffDetails.hospitalStaffAddress}</p>
                    <p className="mb-2"><strong>Aadhar:</strong> {staffDetails.hospitalStaffAadhar}</p>
                  </div>
                </div>
                <div className="card-footer d-flex justify-content-center bg-transparent border-top-0">
                  <button className="btn btn-primary me-3" onClick={handleUnsuspendStaff} style={{ borderRadius: '50px', padding: '10px 30px', boxShadow: '0 4px 8px rgba(0,0,0,.1)' }}>Unsuspend</button>
                </div>
              </div>
            ) : (
              <p className="text-center">No staff details found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  </div>
  <Footer />
</div>


  
  





    );
};

export default HospitalViewOneSuspendedStaff;
