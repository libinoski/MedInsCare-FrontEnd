import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

const HospitalUpdateStaff = () => {
    const navigate = useNavigate();
    const [hospitalStaff, setHospitalStaff] = useState({
        hospitalStaffId: '',
        hospitalId: '',
        hospitalStaffName: '',
        hospitalStaffMobile: '',
        hospitalStaffAddress: '',
        hospitalStaffAadhar: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Fetch hospital staff details based on staffId or from session storage
        const fetchHospitalStaffDetails = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewOneHospitalStaff',
                    { hospitalId, hospitalStaffId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setHospitalStaff(response.data.data);
                }
            } catch (error) {
                handleRequestError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHospitalStaffDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHospitalStaff({
            ...hospitalStaff,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/updateHospitalStaff',
                hospitalStaff,
                {
                    headers: {
                        token
                    }
                }
            );
            if (response.status === 200) {
                alert('Hospital staff updated successfully.');
                // Redirect to a suitable page after updating staff details
                navigate('/hospitalViewAllStaffs');
            }
        } catch (error) {
            handleRequestError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestError = (error) => {
        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 400:
                    setErrors(data.results || {});
                    break;
                case 401:
                case 403:
                    alert(data.message || 'Unauthorized access. Please login again.');
                    navigate('/hospitalLogin');
                    break;
                case 404:
                    alert(data.message || 'Resource not found.');
                    break;
                case 422:
                    alert(data.error || 'Hospital staff not found.');
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

    return (
        <div>
            <Navbar />
            <div className="container py-5">
                <h2 className="mb-4">Update Staff</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label">Name</label>
                        <input type="text" className="form-control" name="hospitalStaffName" value={hospitalStaff.hospitalStaffName} onChange={handleChange} />
                        {errors.hospitalStaffName && <div className="text-danger">{errors.hospitalStaffName}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Mobile</label>
                        <input type="text" className="form-control" name="hospitalStaffMobile" value={hospitalStaff.hospitalStaffMobile} onChange={handleChange} />
                        {errors.hospitalStaffMobile && <div className="text-danger">{errors.hospitalStaffMobile}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Address</label>
                        <input type="text" className="form-control" name="hospitalStaffAddress" value={hospitalStaff.hospitalStaffAddress} onChange={handleChange} />
                        {errors.hospitalStaffAddress && <div className="text-danger">{errors.hospitalStaffAddress}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Aadhar</label>
                        <input type="text" className="form-control" name="hospitalStaffAadhar" value={hospitalStaff.hospitalStaffAadhar} onChange={handleChange} />
                        {errors.hospitalStaffAadhar && <div className="text-danger">{errors.hospitalStaffAadhar}</div>}
                    </div>
                    <button type="submit" className="btn btn-primary" disabled={isLoading}>Update</button>
                </form>
            </div>
            <Footer />
        </div>
    );
};

export default HospitalUpdateStaff;
