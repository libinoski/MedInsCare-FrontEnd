import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';

const HospitalSearchStaffs = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async () => {
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/searchHospitalStaff',
                { hospitalId, searchQuery },
                {
                    headers: {
                        token
                    }
                }
            );
            if (response.status === 200) {
                setSearchResult(response.data.data);
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        alert(data.results || {})
                        break;
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 422:
                        alert(data.error || 'No hospital staffs found.');
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

    return (
        <div>
            <Navbar />
            <div className="container">
                <h2 className="text-center mt-5 mb-4">Search Hospital Staffs</h2>
                <div className="row justify-content-center">
                    <div className="col-lg-8">
                        <div className="input-group mb-3">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter search query"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <div className="input-group-append">
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={handleSearch}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {isLoading ? (
                    <p className="text-center">Searching staffs...</p>
                ) : (
                    <div className="row justify-content-center">
                        <div className="col-lg-10">
                            {searchResult.length > 0 ? (
                                <div className="row">
                                    {searchResult.map((staff, index) => (
                                        <div className="col-md-6 mb-4" key={index}>
                                            <div className="card">
                                                <div className="card-body">
                                                    <h5 className="card-title">{staff.hospitalStaffName}</h5>
                                                    <p className="card-text"><strong>Email:</strong> {staff.hospitalStaffEmail}</p>
                                                    <p className="card-text"><strong>Aadhar:</strong> {staff.hospitalStaffAadhar}</p>
                                                    <p className="card-text"><strong>Mobile:</strong> {staff.hospitalStaffMobile}</p>
                                                    <p className="card-text"><strong>Address:</strong> {staff.hospitalStaffAddress}</p>
                                                    
                                                    <div>
                                                        <strong>Profile Image:</strong><br />
                                                        <img src={staff.hospitalStaffProfileImage} alt="Profile" className="img-fluid" />
                                                    </div>
                                                    <div>
                                                        <strong>ID Proof Image:</strong><br />
                                                        <img src={staff.hospitalStaffIdProofImage} alt="ID Proof" className="img-fluid" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center">No staffs found.</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HospitalSearchStaffs;
