import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/Hospital/doc.jpg'; // Import the background image

const HospitalRegisterStaff = () => {
    const initialStaffData = {
        hospitalStaffName: '',
        hospitalStaffEmail: '',
        hospitalStaffAadhar: '',
        hospitalStaffMobile: '',
        hospitalStaffPassword: '',
        hospitalStaffAddress: '',
        hospitalId: sessionStorage.getItem('hospitalId'),
        hospitalStaffIdProofImage: null,
        hospitalStaffProfileImage: null,
    };

    const navigate = useNavigate();
    const [staffData, setStaffData] = useState(initialStaffData);
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const fileInputIdProofRef = useRef(null);
    const fileInputProfileRef = useRef(null);

    const resetForm = () => {
        setStaffData(initialStaffData);
        setValidationErrors({});
        if (fileInputIdProofRef.current && fileInputProfileRef.current) {
            fileInputIdProofRef.current.value = '';
            fileInputProfileRef.current.value = '';
        }
    };

    const handleImageChange = (event) => {
        const { name, files } = event.target;
        const file = files[0];
        setStaffData({ ...staffData, [name]: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setValidationErrors({});

        try {
            const formData = new FormData();
            Object.entries(staffData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const response = await axios.post('http://localhost:1313/api/mic/hospital/hospitalStaffRegister', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'token': sessionStorage.getItem('token'),
                },
            });

            switch (response.status) {
                case 200:
                    alert(response.data.message || 'Staff registered successfully');
                    resetForm();
                    navigate('/hospitalViewProfile');
                    break;
                default:
                    alert('An unexpected response was received from the server');
                    break;
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        setValidationErrors(data.results || {});
                        break;
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 422:
                        if (data && data.error) {
                            // Construct a readable error message from the error object
                            let errorMessage = '';
                            Object.entries(data.error).forEach(([field, messages]) => {
                                errorMessage += `${field}: ${messages.join(', ')}\n`;
                            });
                            alert(errorMessage);
                        } else {
                            alert('Validation error during registration');
                        }
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

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setStaffData({ ...staffData, [name]: value });
        if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: '' });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                            <div className="card h-100" style={{ textAlign: 'left', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                                <div className="card-body d-flex flex-column">
                                    <h5 className="card-title">Hospital Staff Registration</h5>
                                    <form onSubmit={handleSubmit} className="flex-grow-1 overflow-y-auto">
                                        <div className="mb-3">
                                            <label htmlFor="hospitalStaffName" className="form-label">Name:</label>
                                            <input
                                                type="text"
                                                className={`form-control ${validationErrors.hospitalStaffName ? 'is-invalid' : ''}`}
                                                id="hospitalStaffName"
                                                name="hospitalStaffName"
                                                value={staffData.hospitalStaffName}
                                                onChange={handleInputChange}
                                                placeholder="Enter Name"
                                            />
                                            {validationErrors.hospitalStaffName && <div className="invalid-feedback">{validationErrors.hospitalStaffName}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="hospitalStaffEmail" className="form-label">Email:</label>
                                            <input
                                                type="email"
                                                className={`form-control ${validationErrors.hospitalStaffEmail ? 'is-invalid' : ''}`}
                                                id="hospitalStaffEmail"
                                                name="hospitalStaffEmail"
                                                value={staffData.hospitalStaffEmail}
                                                onChange={handleInputChange}
                                                placeholder="Enter Email"
                                            />
                                            {validationErrors.hospitalStaffEmail && <div className="invalid-feedback">{validationErrors.hospitalStaffEmail}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="hospitalStaffAadhar" className="form-label">Aadhar Number:</label>
                                            <input
                                                type="text"
                                                className={`form-control ${validationErrors.hospitalStaffAadhar ? 'is-invalid' : ''}`}
                                                id="hospitalStaffAadhar"
                                                name="hospitalStaffAadhar"
                                                value={staffData.hospitalStaffAadhar}
                                                onChange={handleInputChange}
                                                placeholder="Enter Aadhar Number"
                                            />
                                            {validationErrors.hospitalStaffAadhar && <div className="invalid-feedback">{validationErrors.hospitalStaffAadhar}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="hospitalStaffMobile" className="form-label">Mobile Number:</label>
                                            <input
                                                type="text"
                                                className={`form-control ${validationErrors.hospitalStaffMobile ? 'is-invalid' : ''}`}
                                                id="hospitalStaffMobile"
                                                name="hospitalStaffMobile"
                                                value={staffData.hospitalStaffMobile}
                                                onChange={handleInputChange}
                                                placeholder="Enter Mobile Number"
                                            />
                                            {validationErrors.hospitalStaffMobile && <div className="invalid-feedback">{validationErrors.hospitalStaffMobile}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="hospitalStaffPassword" className="form-label">Password:</label>
                                            <div className="input-group">
                                                <input
                                                    type={showPassword ? "text" : "password"}
                                                    className={`form-control ${validationErrors.hospitalStaffPassword ? 'is-invalid' : ''}`}
                                                    id="hospitalStaffPassword"
                                                    name="hospitalStaffPassword"
                                                    value={staffData.hospitalStaffPassword}
                                                    onChange={handleInputChange}
                                                    placeholder="Enter Password"
                                                    style={{ height: 'calc(2.25rem + 2px)' }}
                                                />
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={togglePasswordVisibility}
                                                    style={{ height: 'calc(2.25rem + 2px)' }}
                                                >
                                                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                </button>
                                            </div>
                                            {validationErrors.hospitalStaffPassword && <div className="invalid-feedback">{validationErrors.hospitalStaffPassword}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="hospitalStaffAddress" className="form-label">Address:</label>
                                            <textarea
                                                className={`form-control ${validationErrors.hospitalStaffAddress ? 'is-invalid' : ''}`}
                                                id="hospitalStaffAddress"
                                                name="hospitalStaffAddress"
                                                value={staffData.hospitalStaffAddress}
                                                onChange={handleInputChange}
                                                placeholder="Enter Address"
                                            ></textarea>
                                            {validationErrors.hospitalStaffAddress && <div className="invalid-feedback">{validationErrors.hospitalStaffAddress}</div>}
                                        </div>
                                        
                                        <div className="mb-3">
                                            <label htmlFor="hospitalStaffIdProofImage" className="form-label">ID Proof Image:</label>
                                            <input
                                                type="file"
                                                className={`form-control-file ${validationErrors.hospitalStaffIdProofImage ? 'is-invalid' : ''}`}
                                                id="hospitalStaffIdProofImage"
                                                name="hospitalStaffIdProofImage"
                                                onChange={handleImageChange}
                                                accept=".jpg, .jpeg, .png"
                                            />
                                            {validationErrors.hospitalStaffIdProofImage && <div className="invalid-feedback">{validationErrors.hospitalStaffIdProofImage}</div>}
                                        </div>

                                        <div className="mb-3">
                                            <label htmlFor="hospitalStaffProfileImage" className="form-label">Profile Image:</label>
                                            <input
                                                type="file"
                                                className={`form-control-file ${validationErrors.hospitalStaffProfileImage ? 'is-invalid' : ''}`}
                                                id="hospitalStaffProfileImage"
                                                name="hospitalStaffProfileImage"
                                                onChange={handleImageChange}
                                                accept=".jpg, .jpeg, .png"
                                            />
                                            {validationErrors.hospitalStaffProfileImage && <div className="invalid-feedback">{validationErrors.hospitalStaffProfileImage}</div>}
                                        </div>

                                        <div className="text-center">
                                            <button type="submit" className={`btn btn-success ${isLoading ? 'disabled' : ''}`} disabled={isLoading}>
                                                {isLoading ? 'Loading...' : 'Register'}
                                            </button>
                                        </div>
                                    </form>
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

export default HospitalRegisterStaff;
