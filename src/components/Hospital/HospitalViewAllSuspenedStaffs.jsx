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

<div>
    <Navbar />
    <div className="container-fluid py-5 d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}>
        <div className="container overflow-auto p-0" style={{ maxWidth: '100%', maxHeight: '100%' }}>
            {isLoading ? (
                <p className="text-center">Loading suspended staffs...</p>
            ) : (
                <div className="row row-cols-1 row-cols-md-3 g-4">
                    {suspendedStaffs.length > 0 ? (
                        suspendedStaffs.map((staff, index) => (
                            <div className="col" key={index} onClick={() => handleViewDetails(staff.hospitalStaffId)}>
                                <div className="card h-100" style={{ cursor: 'pointer', border: '2px solid red', borderRadius: '10px' }}>
                                    <img src={staff.hospitalStaffProfileImage} className="card-img-top" alt="Staff" style={{ height: '200px', objectFit: 'cover', borderRadius: '10px 10px 0 0' }} />
                                    <div className="card-body">
                                        <h5 className="card-title">{staff.hospitalStaffName}</h5>
                                        <p className="card-text"><strong>Email:</strong> {staff.hospitalStaffEmail}</p>
                                        <p className="card-text"><strong>Mobile:</strong> {staff.hospitalStaffMobile}</p>
                                        <p className="card-text"><strong>Address:</strong> {staff.hospitalStaffAddress}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-12">
                            <p className="text-center">No suspended staffs available.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    </div>
    <Footer />
</div>




    );
};

export default HospitalViewAllSuspendedStaffs;
