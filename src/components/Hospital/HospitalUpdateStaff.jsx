import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/Hospital/bg1.jpg'; // Import the background image

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
    const [showConfirmation, setShowConfirmation] = useState(false); // New state for confirmation

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
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setShowConfirmation(false); // Close the confirmation dialog
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

    const handleConfirmation = () => {
        // Check if there are any validation errors
        const hasErrors = Object.keys(errors).length > 0;
        if (!hasErrors) {
            // If no errors, then show confirmation and submit
            setShowConfirmation(true);
        } else {
            // If there are errors, submit without showing confirmation
            handleSubmit();
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
            <div
                className="container-fluid bg-blur"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    paddingTop: '56px',
                    position: 'relative',
                }}
            >
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-md-6">
                            <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="mb-3">
                                            <label className="form-label">Name</label>
                                            <input type="text" className={`form-control ${errors.hospitalStaffName ? 'is-invalid' : ''}`} name="hospitalStaffName" value={hospitalStaff.hospitalStaffName} onChange={handleChange} />
                                            {errors.hospitalStaffName && <div className="invalid-feedback">{errors.hospitalStaffName}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Mobile</label>
                                            <input type="text" className={`form-control ${errors.hospitalStaffMobile ? 'is-invalid' : ''}`} name="hospitalStaffMobile" value={hospitalStaff.hospitalStaffMobile} onChange={handleChange} />
                                            {errors.hospitalStaffMobile && <div className="invalid-feedback">{errors.hospitalStaffMobile}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Address</label>
                                            <input type="text" className={`form-control ${errors.hospitalStaffAddress ? 'is-invalid' : ''}`} name="hospitalStaffAddress" value={hospitalStaff.hospitalStaffAddress} onChange={handleChange} />
                                            {errors.hospitalStaffAddress && <div className="invalid-feedback">{errors.hospitalStaffAddress}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label className="form-label">Aadhar</label>
                                            <input type="text" className={`form-control ${errors.hospitalStaffAadhar ? 'is-invalid' : ''}`} name="hospitalStaffAadhar" value={hospitalStaff.hospitalStaffAadhar} onChange={handleChange} />
                                            {errors.hospitalStaffAadhar && <div className="invalid-feedback">{errors.hospitalStaffAadhar}</div>}
                                        </div>
                                        <div className="text-center">
                                            <button type="button" className="btn btn-primary" onClick={handleConfirmation} disabled={isLoading}>
                                                {isLoading ? 'Updating...' : 'Update'}
                                            </button>
                                        </div>
                                    </form>
                                    {showConfirmation && (
                                        <div className="mt-3 text-center">
                                            <p>Are you sure you want to update the hospital staff details?</p>
                                            <button type="button" className="btn btn-secondary mr-2" onClick={() => setShowConfirmation(false)}>Cancel</button>
                                            <button type="button" className="btn btn-success" onClick={handleSubmit}>Confirm</button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default HospitalUpdateStaff;
