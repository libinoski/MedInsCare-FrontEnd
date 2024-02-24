import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/Hospital/HospitalRegisterStaff.css';

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
    const [idProofImagePreview, setIdProofImagePreview] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const fileInputIdProofRef = useRef(null);
    const fileInputProfileRef = useRef(null);

    const resetForm = () => {
        setStaffData(initialStaffData);
        setIdProofImagePreview(null);
        setProfileImagePreview(null);
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
        if (name === 'hospitalStaffIdProofImage') {
            setIdProofImagePreview(URL.createObjectURL(file));
        } else if (name === 'hospitalStaffProfileImage') {
            setProfileImagePreview(URL.createObjectURL(file));
        }
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
                                const errorMessages = Object.values(data.error).join('\n');
                                alert(`Validation Error:\n${errorMessages}`);
                                // Set validation errors in the state
                                setValidationErrors(data.error);
                            } else {
                                alert('An error occurred. Please try again.');
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

    return (
        <div className="hospital-registration-container">
            <div className="card hospital-registration-card">
                <div className="card-body">
                    <h1 className="card-title hospital-registration-title text-center">Register Staff</h1>
                    <form onSubmit={handleSubmit} noValidate className="hospital-registration-form">
                        {/* Hospital Staff Name */}
                        <div className="form-group">
                            <label htmlFor="hospitalStaffName">Name:</label>
                            <input
                                type="text"
                                className={`form-control ${validationErrors.hospitalStaffName ? 'is-invalid' : ''}`}
                                id="hospitalStaffName"
                                name="hospitalStaffName"
                                value={staffData.hospitalStaffName}
                                onChange={handleInputChange}
                                placeholder="Enter Name"
                                required
                            />
                            {validationErrors.hospitalStaffName && <div className="invalid-feedback">{validationErrors.hospitalStaffName}</div>}
                        </div>

                        {/* Hospital Staff Email */}
                        <div className="form-group">
                            <label htmlFor="hospitalStaffEmail">Email:</label>
                            <input
                                type="email"
                                className={`form-control ${validationErrors.hospitalStaffEmail ? 'is-invalid' : ''}`}
                                id="hospitalStaffEmail"
                                name="hospitalStaffEmail"
                                value={staffData.hospitalStaffEmail}
                                onChange={handleInputChange}
                                placeholder="Enter Email"
                                required
                            />
                            {validationErrors.hospitalStaffEmail && <div className="invalid-feedback">{validationErrors.hospitalStaffEmail}</div>}
                        </div>

                        {/* Hospital Staff Aadhar */}
                        <div className="form-group">
                            <label htmlFor="hospitalStaffAadhar">Aadhar Number:</label>
                            <input
                                type="text"
                                className={`form-control ${validationErrors.hospitalStaffAadhar ? 'is-invalid' : ''}`}
                                id="hospitalStaffAadhar"
                                name="hospitalStaffAadhar"
                                value={staffData.hospitalStaffAadhar}
                                onChange={handleInputChange}
                                placeholder="Enter Aadhar Number"
                                required
                            />
                            {validationErrors.hospitalStaffAadhar && <div className="invalid-feedback">{validationErrors.hospitalStaffAadhar}</div>}
                        </div>

                        {/* Hospital Staff Mobile */}
                        <div className="form-group">
                            <label htmlFor="hospitalStaffMobile">Mobile Number:</label>
                            <input
                                type="text"
                                className={`form-control ${validationErrors.hospitalStaffMobile ? 'is-invalid' : ''}`}
                                id="hospitalStaffMobile"
                                name="hospitalStaffMobile"
                                value={staffData.hospitalStaffMobile}
                                onChange={handleInputChange}
                                placeholder="Enter Mobile Number"
                                required
                            />
                            {validationErrors.hospitalStaffMobile && <div className="invalid-feedback">{validationErrors.hospitalStaffMobile}</div>}
                        </div>

                        {/* Hospital Staff Password */}
                        <div className="form-group">
                            <label htmlFor="hospitalStaffPassword">Password:</label>
                            <input
                                type="password"
                                className={`form-control ${validationErrors.hospitalStaffPassword ? 'is-invalid' : ''}`}
                                id="hospitalStaffPassword"
                                name="hospitalStaffPassword"
                                value={staffData.hospitalStaffPassword}
                                onChange={handleInputChange}
                                placeholder="Enter Password"
                                required
                            />
                            {validationErrors.hospitalStaffPassword && <div className="invalid-feedback">{validationErrors.hospitalStaffPassword}</div>}
                        </div>

                        {/* Hospital Staff Address */}
                        <div className="form-group">
                            <label htmlFor="hospitalStaffAddress">Address:</label>
                            <textarea
                                className={`form-control ${validationErrors.hospitalStaffAddress ? 'is-invalid' : ''}`}
                                id="hospitalStaffAddress"
                                name="hospitalStaffAddress"
                                value={staffData.hospitalStaffAddress}
                                onChange={handleInputChange}
                                placeholder="Enter Address"
                                required
                            ></textarea>
                            {validationErrors.hospitalStaffAddress && <div className="invalid-feedback">{validationErrors.hospitalStaffAddress}</div>}
                        </div>

                        {/* Hospital Staff ID Proof Image */}
                        <div className="form-group">
                            <label htmlFor="hospitalStaffIdProofImage">ID Proof Image:</label>
                            <input
                                type="file"
                                className={`form-control-file ${validationErrors.hospitalStaffIdProofImage ? 'is-invalid' : ''}`}
                                id="hospitalStaffIdProofImage"
                                name="hospitalStaffIdProofImage"
                                onChange={handleImageChange}
                                accept=".jpg, .jpeg, .png"
                                ref={fileInputIdProofRef}
                                required
                            />
                            {validationErrors.hospitalStaffIdProofImage && <div className="invalid-feedback">{validationErrors.hospitalStaffIdProofImage}</div>}
                        </div>

                        {/* Hospital Staff Profile Image */}
                        <div className="form-group">
                            <label htmlFor="hospitalStaffProfileImage">Profile Image:</label>
                            <input
                                type="file"
                                className={`form-control-file ${validationErrors.hospitalStaffProfileImage ? 'is-invalid' : ''}`}
                                id="hospitalStaffProfileImage"
                                name="hospitalStaffProfileImage"
                                onChange={handleImageChange}
                                accept=".jpg, .jpeg, .png"
                                ref={fileInputProfileRef}
                                required
                            />
                            {validationErrors.hospitalStaffProfileImage && <div className="invalid-feedback">{validationErrors.hospitalStaffProfileImage}</div>}
                        </div>

                        {/* Image preview containers */}
                        <div className="image-preview-container">
                            {idProofImagePreview ? (
                                <img id="idProofImagePreview" className="image-preview" src={idProofImagePreview} alt="ID Proof" />
                            ) : (
                                <span>No ID proof image selected</span>
                            )}
                            <div id="idProofImageError" className="invalid-feedback">{validationErrors.hospitalStaffIdProofImage}</div>
                        </div>
                        <div className="image-preview-container">
                            {profileImagePreview ? (
                                <img id="profileImagePreview" className="image-preview" src={profileImagePreview} alt="Profile Pic" />
                            ) : (
                                <span>No profile image selected</span>
                            )}
                            <div id="profileImageError" className="invalid-feedback">{validationErrors.hospitalStaffProfileImage}</div>
                        </div>

                        {/* Submit button */}
                        <div className="form-footer mt-3">
                            <button type="submit" className={`btn btn-success ${isLoading ? 'loading' : ''}`} disabled={isLoading}>
                                {isLoading ? 'Loading...' : 'Register'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HospitalRegisterStaff;

