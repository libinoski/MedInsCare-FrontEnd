import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
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
    <div>
        <Navbar />
    </div>
    <div className="container flex-grow-1" style={{ overflowY: 'auto', paddingTop: '70px', paddingBottom: '70px' }}>
        {isLoading ? (
            <div className="text-center alert alert-info">Loading staffs...</div>
        ) : staffList.length > 0 ? (
            <div className="d-flex flex-wrap justify-content-center pt-5 pb-5">
                {staffList.map((staff, index) => (
                    <div
                        key={index}
                        className="card shadow-sm rounded-3 mb-3 mx-2" style={{ width: '18rem', cursor: 'pointer' }}
                        onClick={() => handleViewStaff(staff.hospitalStaffId)}
                    >
                        <div className="card-body">
                            {staff.hospitalStaffProfileImage && (
                                <img
                                    src={staff.hospitalStaffProfileImage}
                                    className="card-img-top img-fluid rounded-circle mb-3"
                                    alt="Staff"
                                    style={{ height: '100px', width: '100px', objectFit: 'cover' }}
                                />
                            )}
                            <h5 className="card-title">{staff.hospitalStaffName}</h5>
                            <p className="card-text">{staff.hospitalStaffEmail}</p>
                            <p className="card-text text-muted">
                                Aadhar: {staff.hospitalStaffAadhar}, Mobile: {staff.hospitalStaffMobile}, Address: {staff.hospitalStaffAddress}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center alert alert-warning mt-4">No staffs found.</div>
        )}
    </div>
    <div>
        <Footer />
    </div>
</div>








    );
};

export default HospitalViewAllStaffs;
