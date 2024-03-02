import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/Hospital/hr.jpg'; // Import the background image

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
    <div className="container-fluid py-5" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="container" style={{ maxWidth: '100%', padding: '0 15px', overflowY: 'auto', maxHeight: '100%' }}>
            {isLoading ? (
                <p className="text-center">Loading suspended staffs...</p>
            ) : (
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {suspendedStaffs.length > 0 ? (
                        suspendedStaffs.map((staff, index) => (
                            <div className="col" key={index} onClick={() => handleViewDetails(staff.hospitalStaffId)}>
                                <div className="card h-100 border-0 shadow" style={{ cursor: 'pointer' }}>
                                    <img src={staff.hospitalStaffProfileImage} className="card-img-top" alt="Staff" style={{ height: '200px', objectFit: 'cover' }} />
                                    <div className="card-body">
                                        <h5 className="card-title">{staff.hospitalStaffName}</h5>
                                        <p className="card-text"><strong>Email:</strong> {staff.hospitalStaffEmail}</p>
                                        <p className="card-text"><strong>Mobile:</strong> {staff.hospitalStaffMobile}</p>
                                        <p className="card-text"><strong>Address:</strong> {staff.hospitalStaffAddress}</p>
                                    </div>
                                    {/* Removed button from card footer */}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center w-100">No suspended staffs available.</p>
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
