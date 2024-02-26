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
<div className="d-flex flex-column" style={{ height: '100vh' }}>
    <Navbar />
    <div className="flex-grow-1 container-fluid mt-0 position-relative" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', marginTop: '-56px' }}>
        {isLoading ? (
            <p className="text-center">Loading staffs...</p>
        ) : (
            <div className="position-relative">
                <div className="glass-effect position-absolute top-0 left-0 w-100 h-100"></div>
                <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.5)', borderRadius: '10px', padding: '20px' }}>
                    <table className="table table-striped table-hover text-center align-middle" style={{ backgroundColor: 'transparent', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Aadhar</th>
                                <th>Mobile</th>
                                <th>Address</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {staffList.length > 0 ? (
                                staffList.map((staff, index) => (
                                    <tr key={index}>
                                        <td>{staff.hospitalStaffName}</td>
                                        <td>{staff.hospitalStaffEmail}</td>
                                        <td>{staff.hospitalStaffAadhar}</td>
                                        <td>{staff.hospitalStaffMobile}</td>
                                        <td>{staff.hospitalStaffAddress}</td>
                                        <td>
                                            <button className="btn btn-primary" onClick={() => handleViewStaff(staff.hospitalStaffId)}>View</button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No staffs found.</td>
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
