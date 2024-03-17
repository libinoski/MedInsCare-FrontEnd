import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import HospitalNavbar from './HospitalNavbar';

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
<div className="d-flex flex-column min-vh-100" style={{
    background: 'linear-gradient(to right, #1a1a1a, #000000)',
}}>
    <HospitalNavbar />
    <div className="container flex-grow-1 mt-4">
        <div className="row justify-content-center mb-5">
            <div className="col-lg-8 col-md-12 col-12">
                <div className="input-group" style={{ width: '100%' }}>
                    <input
                        type="text"
                        className="form-control py-3"
                        placeholder="Enter staff name" // Adjusted placeholder text
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            borderRadius: '30px 0 0 30px',
                            fontSize: '1.2rem',
                            padding: '15px 20px',
                            height: 'auto',
                            border: '1px solid #ced4da',
                            boxShadow: 'inset 0 1px 2px rgba(0,0,0,.075)',
                            backgroundColor: '#ffffff', // Changed background color to white
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
                                boxShadow: '0 2px 4px rgba(0,0,0,.2)',
                                backgroundColor: '#007bff', // Changed background color to blue
                                border: '1px solid #007bff', // Added border to match background color
                            }}
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {isLoading ? (
            <p className="text-center">Searching staffs...</p> // Updated loading message
        ) : (
            <>
                {searchResult.length > 0 ? (
                    <div className="row justify-content-center">
                        {searchResult.map((staff, index) => (
                            <div className="col-lg-3 col-md-4 col-12 mb-4" key={index}>
                                <div
                                    className="card h-100 text-center"
                                    style={{
                                        backgroundColor: '#ffffff',
                                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                        transition: 'transform 0.3s ease, boxShadow 0.3s ease, border-color 0.3s ease',
                                        cursor: 'pointer',
                                        borderRadius: '15px',
                                        border: '1px solid transparent', // Added transparent border
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.transform = 'scale(1.05)';
                                        e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                                        e.currentTarget.style.borderColor = '#007bff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'scale(1)';
                                        e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                                        e.currentTarget.style.borderColor = 'transparent';
                                    }}
                                    onClick={() => handleViewStaff(staff.hospitalStaffId)} // Function name unchanged
                                >
                                    <div style={{ backgroundColor: '#f8f9fa', borderTopLeftRadius: '15px', borderTopRightRadius: '15px' }}>
                                        <img
                                            src={staff.hospitalStaffProfileImage}
                                            alt="Profile"
                                            className="rounded-circle"
                                            style={{ width: '100px', height: '100px', objectFit: 'cover', margin: '0 auto', border: '3px solid #ffffff', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }} // Rounded image
                                        />
                                    </div>
                                    <div className="card-body" style={{ border: '2px solid transparent', padding: '20px' }}>
                                        <h5 className="card-title mb-4" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                            {staff.hospitalStaffName}
                                        </h5>
                                        <p className="mb-2"><strong>Email:</strong> {staff.hospitalStaffEmail}</p>
                                        <p className="mb-2"><strong>Aadhar:</strong> {staff.hospitalStaffAadhar}</p>
                                        <p className="mb-2"><strong>Mobile:</strong> {staff.hospitalStaffMobile}</p>
                                        <p className="mb-0"><strong>Address:</strong> {staff.hospitalStaffAddress}</p>
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