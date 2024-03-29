
import React, { useState, useRef } from 'react';
import axios from 'axios';
import '../../css/Hospital/HospitalRegistration.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const HospitalRegistration = () => {
    const initialHospitalData = {
        hospitalName: '',
        hospitalEmail: '',
        hospitalAadhar: '',
        hospitalMobile: '',
        hospitalWebSite: '',
        hospitalAddress: '',
        hospitalPassword: '',
        hospitalImage: null,
    };

    const [hospitalData, setHospitalData] = useState(initialHospitalData);
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [submitFailed, setSubmitFailed] = useState(false);
    const fileInputRef = useRef(null);

    const resetForm = () => {
        setHospitalData(initialHospitalData);
        setValidationErrors({});
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleImagePreview = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setHospitalData({ ...hospitalData, hospitalImage: selectedFile });
            const reader = new FileReader();
            reader.onload = (event) => {
                const imagePreview = document.getElementById("image-preview");
                imagePreview.src = event.target.result;
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setValidationErrors({});
        setSubmitFailed(false);

        try {
            const formData = new FormData();
            for (const key in hospitalData) {
                formData.append(key, hospitalData[key]);
            }

            const response = await axios.post('http://localhost:1313/api/mic/hospital/hospitalRegistration', formData);

            switch (response.status) {
                case 201:
                    alert('Hospital registered successfully');
                    resetForm();
                    break;
                default:
                    alert('An unexpected response was received from the server');
                    break;
            }
        } catch (error) {
            setSubmitFailed(true);

            if (error.response) {
                const statusCode = error.response.status;
                switch (statusCode) {
                    case 400:
                        const errorMessage = error.response.data.error;
                        if (errorMessage === 'Validation failed') {
                            const errors = error.response.data.details;
                            const newValidationErrors = {};
                            errors.forEach(err => {
                                newValidationErrors[err.field] = err.message;

                                if (err.field === 'hospitalImage' || err.field === 'hospitalPassword') {
                                    alert(`${err.field} validation failed: ${err.message}`);
                                }
                            });
                            setValidationErrors(newValidationErrors);
                        } else if (errorMessage === 'Email already exists') {
                            alert('Email already exists. Please use a different email.');
                        } else if (errorMessage === 'Aadhar number already exists') {
                            alert('Aadhar number already exists. Please use a different Aadhar number.');
                        }
                        break;
                    case 500:
                        alert('Internal server error. Please try again later.');
                        break;
                    default:
                        alert('An error occurred. Please try again.');
                        break;
                }
            } else {
                alert('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHospitalData({ ...hospitalData, [name]: value });
    };

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };


    return (
        <div className="hospital-registration-container">
            <div className="card hospital-registration-card">
                <div className="card-body">
                    <h1 className="card-title hospital-registration-title text-center">Enroll Your Hospital Today: Join Our Network</h1>
                    <form onSubmit={handleSubmit} noValidate className="hospital-registration-form">
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="hospitalName" className="font-weight-bold">Hospital Name</label>
                                    <input
                                        type="text"
                                        className={`form-control ${validationErrors.hospitalName ? 'is-invalid' : ''}`}
                                        id="hospitalName"
                                        name="hospitalName"
                                        value={hospitalData.hospitalName}
                                        onChange={handleChange}
                                        placeholder="Enter Hospital Name"
                                        required
                                    />
                                    {validationErrors.hospitalName && <div className="invalid-feedback">{validationErrors.hospitalName}</div>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="hospitalEmail" className="font-weight-bold">Email</label>
                                    <input
                                        type="text"
                                        className={`form-control ${validationErrors.hospitalEmail ? 'is-invalid' : ''} custom-email-input`}
                                        id="hospitalEmail"
                                        name="hospitalEmail"
                                        value={hospitalData.hospitalEmail}
                                        onChange={handleChange}
                                        placeholder="Enter Email"
                                        required
                                    />
                                    {validationErrors.hospitalEmail && <div className="invalid-feedback">{validationErrors.hospitalEmail}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="hospitalAadhar" className="font-weight-bold">Aadhar Number</label>
                                    <input
                                        type="text"
                                        className={`form-control ${validationErrors.hospitalAadhar ? 'is-invalid' : ''}`}
                                        id="hospitalAadhar"
                                        name="hospitalAadhar"
                                        value={hospitalData.hospitalAadhar}
                                        onChange={handleChange}
                                        placeholder="Enter Aadhar Number"
                                        required
                                    />
                                    {validationErrors.hospitalAadhar && <div className="invalid-feedback">{validationErrors.hospitalAadhar}</div>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="hospitalMobile" className="font-weight-bold">Mobile Number</label>
                                    <input
                                        type="text"
                                        className={`form-control ${validationErrors.hospitalMobile ? 'is-invalid' : ''}`}
                                        id="hospitalMobile"
                                        name="hospitalMobile"
                                        value={hospitalData.hospitalMobile}
                                        onChange={handleChange}
                                        placeholder="Enter Mobile Number"
                                        required
                                    />
                                    {validationErrors.hospitalMobile && <div className="invalid-feedback">{validationErrors.hospitalMobile}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="hospitalWebSite" className="font-weight-bold">Website</label>
                                    <input
                                        type="text"
                                        className={`form-control ${validationErrors.hospitalWebSite ? 'is-invalid' : ''}`}
                                        id="hospitalWebSite"
                                        name="hospitalWebSite"
                                        value={hospitalData.hospitalWebSite}
                                        onChange={handleChange}
                                        placeholder="Enter Website URL"
                                        required
                                    />
                                    {validationErrors.hospitalWebSite && <div className="invalid-feedback">{validationErrors.hospitalWebSite}</div>}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="hospitalAddress" className="font-weight-bold">Address</label>
                                    <input
                                        type="text"
                                        className={`form-control ${validationErrors.hospitalAddress ? 'is-invalid' : ''}`}
                                        id="hospitalAddress"
                                        name="hospitalAddress"
                                        value={hospitalData.hospitalAddress}
                                        onChange={handleChange}
                                        placeholder="Enter Address"
                                        required
                                    />
                                    {validationErrors.hospitalAddress && <div className="invalid-feedback">{validationErrors.hospitalAddress}</div>}
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="hospitalPassword" className="font-weight-bold">Password</label>
                                    <div className="password-container">
                                        <input
                                            type={passwordVisible ? 'text' : 'password'}
                                            className="form-control password-input"
                                            id="hospitalPassword"
                                            name="hospitalPassword"
                                            value={hospitalData.hospitalPassword}
                                            onChange={handleChange}
                                            placeholder="Enter Password"
                                            required
                                        />
                                        <button
                                            type="button"
                                            className="password-toggle-button"
                                            onClick={togglePasswordVisibility}
                                            aria-label="Toggle password visibility"
                                        >
                                            <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="hospitalImage" className="font-weight-bold">Hospital Image</label>
                                    <div className="file-input-container">
                                        <input
                                            type="file"
                                            className={`form-control-file${validationErrors.hospitalImage ? ' is-invalid' : ''}`}
                                            id="hospitalImage"
                                            name="hospitalImage"
                                            onChange={handleImagePreview}
                                            accept=".jpg, .jpeg, .png"
                                            ref={fileInputRef}
                                            style={{ display: 'none' }} // Hide the file input
                                        />
                                        <label htmlFor="hospitalImage" className="choose-file-button">Choose File</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label htmlFor="image-preview" className="font-weight-bold">Image Preview</label>
                                    <div className="image-preview-container">
                                        <img
                                            id="image-preview"
                                            src={hospitalData.hospitalImage ? URL.createObjectURL(hospitalData.hospitalImage) : ''}
                                            alt=""
                                            className="image-preview"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="form-footer mt-3">
                        <button type="submit" className={`btn btn-success ${isLoading ? 'loading' : ''} ${submitFailed ? 'failed' : ''}`} disabled={isLoading}>
                            {isLoading ? 'Submitting...' : 'Register'}
                        </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HospitalRegistration;

