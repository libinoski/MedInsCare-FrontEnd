import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../images/HospitalStaff/7475685_3674981.svg'; // Import the background image
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

const HospitalSearchStaffs = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchExecuted, setSearchExecuted] = useState(false);

    const handleSearch = async () => {
        setIsLoading(true);
        setSearchExecuted(true);
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
                        alert(data.results || {});
                        setSearchResult([]);
                        break;
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        setSearchResult([]);
                        navigate('/hospitalLogin');
                        break;
                    case 422:
                        alert(data.error || 'No hospital staffs found.');
                        setSearchResult([]);
                        break;
                    case 500:
                        alert(data.message || 'Internal server error. Please try again later.');
                        setSearchResult([]);
                        break;
                    default:
                        alert('An error occurred. Please try again.');
                        setSearchResult([]);
                        break;
                }
            } else {
                alert('An error occurred. Please check your connection and try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewStaff = (hospitalStaffId) => {
        sessionStorage.setItem('hospitalStaffId', hospitalStaffId);
        navigate('/hospitalViewOneStaff');
    };

    return (
        <div>
            <Navbar />
            <div
                className="container-fluid"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    paddingTop: '56px',
                    position: 'relative',
                }}
            >
                <div
                    className="container"
                    style={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        maxWidth: '100%',
                        padding: '50px 15px 0',
                        overflowY: 'auto',
                        maxHeight: 'calc(100% - 56px)',
                    }}
                >
                    <div className="row justify-content-center mb-5">
                        <div className="col-lg-8">
                            <div className="input-group" style={{ width: '100%' }}>
                                <input
                                    type="text"
                                    className="form-control py-3"
                                    placeholder="Enter search query"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    style={{
                                        borderRadius: '30px 0 0 30px',
                                        fontSize: '1.2rem', // Increase font size
                                        padding: '15px 20px', // Increase padding
                                        height: 'auto', // Adjust height
                                    }}
                                />
                                <div className="input-group-append">
                                    <button
                                        className="btn btn-primary px-5 py-3"
                                        type="button"
                                        onClick={handleSearch}
                                        style={{
                                            borderRadius: '0 30px 30px 0',
                                            fontSize: '1.2rem', // Increase font size
                                            padding: '15px 30px', // Increase padding
                                            height: 'auto', // Adjust height
                                        }}
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
                        <>
                            {searchResult.length > 0 ? (
                                <div className="row justify-content-center">
                                    {searchResult.map((staff, index) => (
                                        <div className="col-lg-3 col-md-4 mb-4" key={index}>
                                            <div
                                                className="card"
                                                style={{
                                                    backgroundColor: 'white',
                                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                    transition: 'border-color 0.3s ease',
                                                    textAlign: 'center',
                                                    height: '100%',
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = 'blue';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = 'transparent';
                                                }}
                                                onClick={() => handleViewStaff(staff.hospitalStaffId)}
                                            >
                                                <div className="card-body" style={{ border: '2px solid transparent', padding: '20px' }}>
                                                    <div className="mb-4">
                                                        <div className="image-frame">
                                                            <img
                                                                src={staff.hospitalStaffProfileImage}
                                                                alt="Profile"
                                                                style={{ maxHeight: '150px', maxWidth: '100%', borderRadius: '10px' }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <h5 className="card-title mb-4" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                                        {staff.hospitalStaffName}
                                                    </h5>
                                                    <div className="card-text-frame mb-4" style={{ backgroundColor: '#f8f9fa', color: 'black', fontWeight: 'bold', padding: '10px', borderRadius: '10px' }}>
                                                        <p>
                                                            <strong>Email:</strong> {staff.hospitalStaffEmail}
                                                        </p>
                                                        <p>
                                                            <strong>Aadhar:</strong> {staff.hospitalStaffAadhar}
                                                        </p>
                                                        <p>
                                                            <strong>Mobile:</strong> {staff.hospitalStaffMobile}
                                                        </p>
                                                        <p>
                                                            <strong>Address:</strong> {staff.hospitalStaffAddress}
                                                        </p>
                                                    </div>
                                                    <div className="image-frame">
                                                        <img
                                                            src={staff.hospitalStaffIdProofImage}
                                                            alt="ID Proof"
                                                            style={{ maxHeight: '150px', maxWidth: '100%', borderRadius: '10px' }}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : searchExecuted && <p className="text-center">No staffs found.</p>}
                        </>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HospitalSearchStaffs;
