import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import HospitalNavbar from './HospitalNavbar';

const HospitalViewAllSuspendedStaffs = () => {
    const navigate = useNavigate();
    const [suspendedStaffs, setSuspendedStaffs] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchSuspendedStaffs = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewAllSuspendedHospitalStaffs',
                    { hospitalId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setSuspendedStaffs(response.data.data);
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
                            alert(data.error || 'Hospital not found.');
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

        fetchSuspendedStaffs();
    }, [navigate]);

    const handleViewDetails = (hospitalStaffId) => {
        sessionStorage.setItem('hospitalStaffId', hospitalStaffId);
        navigate('/hospitalViewOneSuspendedStaff');
    };

    return (

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>


       {/* Your Navbar and Footer components */}
      <HospitalNavbar />
      <div className="container my-5 flex-grow-1">
          <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
              {isLoading ? (
                  <div className="col-12 text-center">
                      <div className="spinner-border text-primary" role="status">
                          <span className="visually-hidden">Loading suspended staffs...</span>
                      </div>
                  </div>
              ) : suspendedStaffs.length > 0 ? (
                  suspendedStaffs.map((staff, index) => (
                      <div className="col" key={index}>
                          <div
                              className="card h-100 shadow-sm position-relative"
                              style={{
                                  cursor: 'pointer',
                                  transition: 'transform 0.3s ease, border 0.3s ease',
                                  borderRadius: '15px',
                                  border: '1px solid transparent'
                              }}
                              onMouseEnter={(e) => {
                                  e.currentTarget.style.transform = 'scale(1.05)';
                                  e.currentTarget.style.border = '1px solid #007bff';
                              }}
                              onMouseLeave={(e) => {
                                  e.currentTarget.style.transform = 'scale(1)';
                                  e.currentTarget.style.border = '1px solid transparent';
                              }}
                              onClick={() => handleViewDetails(staff.hospitalStaffId)}
                          >
                              <div className="card-body text-center">
                                  <div style={{
                                      width: '100px',
                                      height: '100px',
                                      overflow: 'hidden',
                                      borderRadius: '50%',
                                      border: '3px solid #007bff',
                                      margin: '0 auto 1rem'
                                  }}>
                                      {staff.hospitalStaffProfileImage ? (
                                          <img
                                              src={staff.hospitalStaffProfileImage}
                                              alt="Staff"
                                              className="img-fluid rounded-circle"
                                              style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                          />
                                      ) : (
                                          <div className="bg-secondary d-flex justify-content-center align-items-center h-100 w-100 rounded-circle">
                                              <i className="fas fa-user text-white"></i>
                                          </div>
                                      )}
                                  </div>
                                  <h5 className="card-title mb-2" style={{ fontWeight: '600' }}>{staff.hospitalStaffName}</h5>
                                  <p className="card-text mb-1" style={{ fontSize: '0.9rem' }}><strong>Email:</strong> {staff.hospitalStaffEmail}</p>
                                  <p className="card-text mb-1" style={{ fontSize: '0.9rem' }}><strong>Mobile:</strong> {staff.hospitalStaffMobile}</p>
                                  <p className="card-text mb-0" style={{ fontSize: '0.8rem' }}><strong>Address:</strong> {staff.hospitalStaffAddress}</p>
                              </div>
                          </div>
                      </div>
                  ))
              ) : (
                  <div className="col-12 text-center">
                      <div className="alert alert-warning" role="alert">
                          No suspended staffs available.
                      </div>
                  </div>
              )}
          </div>
      </div>
      <Footer/>
  </div>


    );
};

export default HospitalViewAllSuspendedStaffs;
