import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import backgroundImage from '../../images/Hospital/doc.jpg'; // Import the background image
import Footer from '../Common/Footer';


const HospitalViewAllStaffs = () => {
    const navigate = useNavigate();
    const [staffList, setStaffList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleErrors = (error) => {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 422:
                        const errorMessage422 = data.error || "An error occurred while fetching staffs.";
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
        };

        const fetchStaffs = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewAllHospitalStaffs',
                    { hospitalId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setStaffList(response.data.data);
                    const staffIds = response.data.data.map(staff => staff.hospitalStaffId);
                    sessionStorage.setItem('hospitalStaffIds', JSON.stringify(staffIds));
                }
            } catch (error) {
                handleErrors(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchStaffs();
    }, [navigate]);

    const handleViewStaff = (hospitalStaffId) => {
        sessionStorage.setItem('hospitalStaffId', hospitalStaffId);
        navigate(`/hospitalViewOneStaff`);
    };

    return (
        <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
            <Navbar />
            <div
                className="flex-grow-1 container-fluid p-0"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    paddingTop: '60px',
                    overflowY: 'auto',
                }}
            >
                {isLoading ? (
                    <p className="text-center">Loading staffs...</p>
                ) : staffList.length > 0 ? (
                    <div className="d-flex flex-column align-items-center justify-content-center pt-5 pb-5" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                        {staffList.map((staff, index) => (
                            <div
                                key={index}
                                className="d-flex align-items-center justify-content-start bg-white shadow rounded-3 mb-3 p-3 w-75"
                                style={{
                                    cursor: 'pointer',
                                    backdropFilter: 'blur(5px)',
                                    backgroundColor: 'rgba(255, 255, 255, 0.85)', // Adjusted for better readability
                                }}
                                onClick={() => handleViewStaff(staff.hospitalStaffId)}
                            >
                                {staff.hospitalStaffProfileImage && (
                                    <div className="me-3">
                                        <div className="d-flex justify-content-center align-items-center rounded-circle border border-primary" style={{ width: '60px', height: '60px', overflow: 'hidden' }}>
                                            <img
                                                src={staff.hospitalStaffProfileImage}
                                                className="img-fluid"
                                                alt="Staff"
                                                style={{
                                                    objectFit: 'cover',
                                                    minWidth: '100%',
                                                    minHeight: '100%',
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}
                                <div className="flex-grow-1">
                                    <p className="mb-1 fw-bold text-dark" style={{ fontSize: '1rem' }}>
                                        {staff.hospitalStaffName}
                                    </p>
                                    <p className="mb-1 text-muted" style={{ fontSize: '0.9rem' }}>
                                        {staff.hospitalStaffEmail}
                                    </p>
                                    <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>
                                        Aadhar: {staff.hospitalStaffAadhar}, Mobile: {staff.hospitalStaffMobile}, Address: {staff.hospitalStaffAddress}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-center mt-4">No staffs found.</p>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default HospitalViewAllStaffs;
