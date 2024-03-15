import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
<div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
    <Navbar />
    <div className="container flex-grow-1 mt-4">
        <div className="row justify-content-center mb-5">
            <div className="col-lg-8 col-md-12 col-12">
                <div className="input-group" style={{ width: '100%' }}>
                    <input
                        type="text"
                        className="form-control py-3"
                        placeholder="Enter search query"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            borderRadius: '30px 0 0 30px',
                            fontSize: '1.2rem',
                            padding: '15px 20px',
                            height: 'auto',
                            border: '1px solid #ced4da',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,.075)', // Existing shadow effect for input
                        }}
                    />
                    <div className="input-group-append">
                        <button
                            className="btn btn-primary px-5 py-3"
                            type="button"
                            onClick={handleSearch}
                            style={{
                                borderRadius: '0 30px 30px 0',
                                fontSize: '1.2rem',
                                padding: '15px 30px',
                                height: 'auto',
                                boxShadow: '0 2px 4px rgba(0,0,0,.2)', // Existing shadow effect for button
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
                            <div className="col-lg-3 col-md-4 col-12 mb-4" key={index}>
                                <div
                                    className="card h-100 text-center" // Consistent text alignment
                                    style={{
                                        backgroundColor: 'white',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        transition: 'transform 0.3s ease, boxShadow 0.3s ease, border-color 0.3s ease', // Smooth transitions
                                        cursor: 'pointer', // Interactivity indication
                                        borderRadius: '15px', // Rounded corners for modern appearance
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)'; // Scale effect on hover
                                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)'; // Enhanced shadow on hover
                                        e.currentTarget.style.borderColor = '#007bff'; // Blue border on hover
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)'; // Revert scale effect
                                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)'; // Revert shadow effect
                                        e.currentTarget.style.borderColor = 'transparent'; // Hide border
                                    }}
                                    onClick={() => handleViewStaff(staff.hospitalStaffId)}
                                >
                                    <div style={{ backgroundColor: '#f8f9fa', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                        <img
                                            src={staff.hospitalStaffProfileImage}
                                            alt="Profile"
                                            className="card-img-top"
                                            style={{ height: '200px', objectFit: 'contain', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }} // Consistent rounded corners
                                        />
                                    </div>
                                    <div className="card-body" style={{ padding: '20px' }}>
                                        <h5 className="card-title" style={{ fontSize: '1.2rem', fontWeight: 'bold', marginBottom: '10px' }}>
                                            {staff.hospitalStaffName}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : searchExecuted && <p className="text-center">No staffs found.</p>}
            </>
        )}
    </div>
    <Footer />
</div>

    );
};

export default HospitalSearchStaffs;