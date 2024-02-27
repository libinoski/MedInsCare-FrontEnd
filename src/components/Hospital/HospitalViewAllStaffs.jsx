import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import backgroundImage from '../../images/Hospital/hindoor2.jpg'; // Import the background image
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
    <div className="flex-grow-1 container-fluid mt-0 position-relative" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        {isLoading ? (
            <p className="text-center">Loading staffs...</p>
        ) : (
            <div className="position-relative d-flex align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 70px)' }}>
                <div className="glass-effect position-absolute top-0 left-0 w-100 h-100"></div>
                <div className="table-responsive" style={{ maxWidth: '100%', overflowY: 'auto', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.75)', borderRadius: '20px', padding: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', margin: '20px' }}>
                    <table className="table text-center align-middle" style={{ backgroundColor: 'transparent', borderCollapse: 'separate', borderColor: '#e1e1e1' }}>
                        <thead>
                            <tr style={{ fontSize: '1rem', fontWeight: '600', color: '#495057', backgroundColor: 'rgba(255, 255, 255, 0.85)', borderRadius: '10px' }}>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Aadhar</th>
                                <th>Mobile</th>
                                <th>Address</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.length > 0 ? (
                                staffList.map((staff, index) => (
                                    <tr key={index} style={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', transition: 'background-color 0.3s ease', cursor: 'pointer' }}
                                        onClick={() => handleViewStaff(staff.hospitalStaffId)}>
                                        <td>{staff.hospitalStaffName}</td>
                                        <td>{staff.hospitalStaffEmail}</td>
                                        <td>{staff.hospitalStaffAadhar}</td>
                                        <td>{staff.hospitalStaffMobile}</td>
                                        <td>{staff.hospitalStaffAddress}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="text-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.65)', color: '#6c757d' }}>No staffs found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
    <Footer />
</div>






    );
};

export default HospitalViewAllStaffs;
