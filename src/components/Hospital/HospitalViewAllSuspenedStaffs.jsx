import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

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

<div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
  <Navbar />
  <div className="container my-5">
    <div className="row justify-content-center" style={{ gap: '1rem' }}>
      {isLoading ? (
        <div className="col-12 text-center">
          <div className="alert alert-info">Loading suspended staffs...</div>
        </div>
      ) : suspendedStaffs.length > 0 ? (
        suspendedStaffs.map((staff, index) => (
          <div className="col-lg-4 col-md-6 d-flex align-items-stretch" key={index}>
            <div className="card shadow-sm" style={{ width: '100%' }}>
              <img src={staff.hospitalStaffProfileImage} className="card-img-top" alt="Staff" style={{ objectFit: 'cover', height: '200px' }} />
              <div className="card-body">
                <h5 className="card-title">{staff.hospitalStaffName}</h5>
                <p className="card-text"><strong>Email:</strong> {staff.hospitalStaffEmail}</p>
                <p className="card-text"><strong>Mobile:</strong> {staff.hospitalStaffMobile}</p>
                <p className="card-text"><strong>Address:</strong> {staff.hospitalStaffAddress}</p>
              </div>
              <div className="card-footer bg-transparent">
                <button className="btn btn-primary w-100" onClick={() => handleViewDetails(staff.hospitalStaffId)}>Take actions</button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="col-12 text-center">
          <div className="alert alert-warning">No suspended staffs available.</div>
        </div>
      )}
    </div>
  </div>
  <Footer />
</div>














    );
};

export default HospitalViewAllSuspendedStaffs;
