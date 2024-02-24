import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';

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
        <div>
            <Navbar />
            <div className="container mt-4">
                <h2 className="text-center mb-4">All Hospital Staffs</h2>
                {isLoading ? (
                    <p className="text-center">Loading staffs...</p>
                ) : (
                    <div className="table-responsive">
                        <table className="table table-striped table-hover text-center align-middle">
                            <thead>
                                <tr>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Aadhar</th>
                                    <th>Mobile</th>
                                    <th>Address</th>
                                    {/* <th>Added Date</th>
                                    <th>Updated Date</th>
                                    <th>Delete Status</th>
                                    <th>Is Suspended</th>
                                    <th>Update Status</th>
                                    <th>Is Active</th>
                                    <th>Password Update Status</th>
                                    <th>Profile Image</th>
                                    <th>ID Proof Image</th> */}
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
                                            {/* <td>{staff.addedDate}</td>
                                            <td>{staff.updatedDate}</td>
                                            <td>{staff.deleteStatus}</td>
                                            <td>{staff.isSuspended}</td>
                                            <td>{staff.updateStatus}</td>
                                            <td>{staff.isActive}</td>
                                            <td>{staff.passwordUpdateStatus}</td> */}
                                            {/* <td>
                                                <img src={staff.hospitalStaffProfileImage} alt="Profile" style={{maxWidth: '50px'}} />
                                            </td>
                                            <td>
                                                <img src={staff.hospitalStaffIdProofImage} alt="ID Proof" style={{maxWidth: '50px'}} />
                                            </td> */}
                                            <td>
                                                <button className="btn btn-primary" onClick={() => handleViewStaff(staff.hospitalStaffId)}>View</button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="15" className="text-center">No staffs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HospitalViewAllStaffs;
