import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import HospitalNavbar from './HospitalNavbar';

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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

<HospitalNavbar />
    <div className="container flex-grow-1 my-5">
        {isLoading ? (
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        ) : staffList.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
                {staffList.map((staff, index) => (
                    <div key={index} className="col" onClick={() => handleViewStaff(staff.hospitalStaffId)}>
                        <div className="card h-100 shadow-sm position-relative"
                             style={{
                                 cursor: 'pointer',
                                 transition: 'transform 0.3s ease',
                                 borderRadius: '.5rem',
                                 border: '1px solid transparent'
                             }}
                             onMouseEnter={(e) => {
                                 e.currentTarget.style.transform = 'scale(1.03)';
                                 e.currentTarget.style.boxShadow = '0 0.5rem 1rem rgba(0, 0, 0, 0.15)';
                                 e.currentTarget.style.zIndex = '1000';
                                 e.currentTarget.style.borderColor = '#007bff';
                             }}
                             onMouseLeave={(e) => {
                                 e.currentTarget.style.transform = 'scale(1)';
                                 e.currentTarget.style.boxShadow = '';
                                 e.currentTarget.style.zIndex = '0';
                                 e.currentTarget.style.borderColor = 'transparent';
                             }}
                        >
                            <div className="card-body">
                                <div className="text-center mb-3">
                                    <img
                                        src={staff.hospitalStaffProfileImage || 'placeholder-image-url'} // Replace 'placeholder-image-url' with actual placeholder image URL
                                        alt="Staff"
                                        className="rounded-circle mb-3"
                                        style={{ width: '100px', height: '100px', objectFit: 'cover' }}
                                    />
                                    <h5 className="card-title">{staff.hospitalStaffName}</h5>
                                    <p className="card-text">
                                        <small className="text-muted">{staff.hospitalStaffEmail}</small><br/>
                                        <small className="text-muted">Aadhar: {staff.hospitalStaffAadhar}</small><br/>
                                        <small className="text-muted">Mobile: {staff.hospitalStaffMobile}</small><br/>
                                        <small className="text-muted">Address: {staff.hospitalStaffAddress}</small>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="alert alert-warning text-center" role="alert">
                No staffs found.
            </div>
        )}
    </div>
    <Footer />
</div>

    );
};

export default HospitalViewAllStaffs;
