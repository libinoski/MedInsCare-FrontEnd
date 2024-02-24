import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';

const HospitalViewOneStaff = () => {
    const navigate = useNavigate();
    const [staffDetails, setStaffDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchStaffDetails = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const hospitalStaffId = sessionStorage.getItem('hospitalStaffId'); // Get the hospital staff id from session storage
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewOneHospitalStaff',
                    { hospitalId, hospitalStaffId }, // Pass hospitalStaffId along with hospitalId in the request body
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setStaffDetails(response.data.data);
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
                            const errorMessage422 = data.error || "An error occurred while fetching staff details.";
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchStaffDetails();
    }, [navigate]);

    return (
        <div>
            <Navbar />
            <div className="container">
                <h2 className="text-center mt-5 mb-4">Hospital Staff Details</h2>
                {isLoading ? (
                    <p className="text-center">Loading staff details...</p>
                ) : (
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            {staffDetails ? (
                                <div className="card">
                                    <div className="card-header">
                                        <h5 className="card-title">{staffDetails.hospitalStaffName}</h5>
                                    </div>
                                    <div className="card-body">
                                        <p><strong>Email:</strong> {staffDetails.hospitalStaffEmail}</p>
                                        <p><strong>Aadhar:</strong> {staffDetails.hospitalStaffAadhar}</p>
                                        <p><strong>Mobile:</strong> {staffDetails.hospitalStaffMobile}</p>
                                        <p><strong>Address:</strong> {staffDetails.hospitalStaffAddress}</p>
                                        <p><strong>Added Date:</strong> {staffDetails.addedDate}</p>
                                        <p><strong>Updated Date:</strong> {staffDetails.updatedDate}</p>
                                        <p><strong>Delete Status:</strong> {staffDetails.deleteStatus}</p>
                                        <p><strong>Is Suspended:</strong> {staffDetails.isSuspended}</p>
                                        <p><strong>Update Status:</strong> {staffDetails.updateStatus}</p>
                                        <p><strong>Is Active:</strong> {staffDetails.isActive}</p>
                                        <p><strong>Password Update Status:</strong> {staffDetails.passwordUpdateStatus}</p>
                                        <p><strong>Profile Image:</strong> <img src={staffDetails.hospitalStaffProfileImage} alt="Profile" className="img-fluid" /></p>
                                        <p><strong>ID Proof Image:</strong> <img src={staffDetails.hospitalStaffIdProofImage} alt="ID Proof" className="img-fluid" /></p>
                                    </div>
                                </div>
                            ) : (
                                <p className="text-center">No staff details found.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HospitalViewOneStaff;
