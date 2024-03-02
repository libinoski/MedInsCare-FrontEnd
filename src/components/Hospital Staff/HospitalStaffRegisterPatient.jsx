import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import backgroundImage from '../../images/HospitalStaff/7475685_3674981.svg'; // Import the background image
import Footer from '../Common/Footer';
import HospitalStaffNavbar from './HospitalStaffNavbar';

const HospitalStaffRegisterPatient = () => {
    const initialPatientData = {
        patientName: '',
        patientEmail: '',
        patientAadhar: '',
        patientMobile: '',
        patientPassword: '',
        patientGender: '',
        patientAge: '',
        patientAddress: '',
        hospitalStaffId: sessionStorage.getItem('hospitalStaffId'),
        patientIdProofImage: null,
        patientProfileImage: null,

    };

    const navigate = useNavigate();
    const [patientData, setPatientData] = useState(initialPatientData);
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const fileInputIdProofRef = useRef(null);
    const fileInputProfileRef = useRef(null);
    const [submitFailed, setSubmitFailed] = useState(false);

    const resetForm = () => {
        setPatientData(initialPatientData);
        setValidationErrors({});
        if (fileInputIdProofRef.current && fileInputProfileRef.current) {
            fileInputIdProofRef.current.value = '';
            fileInputProfileRef.current.value = '';
        }
        setSubmitFailed(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setValidationErrors({});

        try {
            const formData = new FormData();
            Object.entries(patientData).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const response = await axios.post('http://localhost:1313/api/mic/hospitalStaff/registerPatient', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'token': sessionStorage.getItem('token'),
                },
            });

            switch (response.status) {
                case 200:
                    alert(response.data.message || 'Patient registered successfully');
                    resetForm();
                    navigate('/hospitalStaffViewProfile');
                    break;
                default:
                    alert('An unexpected response was received from the server');
                    break;
            }
        } catch (error) {
            setSubmitFailed(true);
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
        setPatientData({ ...patientData, [name]: value });
        if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: '' });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleImageUpload = (fileType) => (event) => {
        const file = event.target.files[0];
        setPatientData({ ...patientData, [fileType]: file });
    };

    return (
<div className="container-fluid">
  {/* Navbar Component */}
  <div className="row">
    <div className="col">
      <HospitalStaffNavbar />
    </div>
  </div>

  <div className="row">
    {/* Left Side Image Container */}
    <div className="col-lg-6">
      <div className="d-flex align-items-center justify-content-center" style={{ height: '100%', minHeight: '100vh', background: `url(${backgroundImage})`, backgroundSize: 'contain', backgroundRepeat: 'no-repeat', backgroundPosition: 'center' }}>
        {/* Empty div for background image */}
      </div>
    </div>

    {/* Right Side Registration Card */}
    <div className="col-lg-6 d-flex align-items-center justify-content-center">
      <div className="card shadow-lg p-4" style={{ width: '90%' }}>
        <div className="card-body">
          <h1 className="text-center mb-4">Patient Registration</h1>
          {/* Registration Form */}

          <form onSubmit={handleSubmit} noValidate>
            {/* Name Field */}
            <div className="mb-3">
              <input type="text" className={`form-control ${validationErrors.patientName ? 'is-invalid' : ''}`} name="patientName" value={patientData.patientName} onChange={handleInputChange} placeholder="Name *" required />
              {validationErrors.patientName && <div className="invalid-feedback">{validationErrors.patientName}</div>}
            </div>
            {/* Email Field */}
            <div className="mb-3">
              <input type="email" className={`form-control ${validationErrors.patientEmail ? 'is-invalid' : ''}`} name="patientEmail" value={patientData.patientEmail} onChange={handleInputChange} placeholder="Email *" required />
              {validationErrors.patientEmail && <div className="invalid-feedback">{validationErrors.patientEmail}</div>}
            </div>
            {/* Aadhar Number Field */}
            <div className="mb-3">
              <input type="text" className={`form-control ${validationErrors.patientAadhar ? 'is-invalid' : ''}`} name="patientAadhar" value={patientData.patientAadhar} onChange={handleInputChange} placeholder="Aadhar Number *" required />
              {validationErrors.patientAadhar && <div className="invalid-feedback">{validationErrors.patientAadhar}</div>}
            </div>
            {/* Mobile Number Field */}
            <div className="mb-3">
              <input type="tel" className={`form-control ${validationErrors.patientMobile ? 'is-invalid' : ''}`} name="hospitalStaffMobile" value={patientData.patientMobile} onChange={handleInputChange} placeholder="Mobile Number *" required />
              {validationErrors.patientMobile && <div className="invalid-feedback">{validationErrors.patientMobile}</div>}
            </div>
            {/* Password Field */}
            <div className="mb-3">
              <div className={`input-group ${validationErrors.patientPassword ? 'is-invalid' : ''}`}>
                <input type={showPassword ? "text" : "password"} className="form-control" name="patientPassword" value={patientData.patientPassword} onChange={handleInputChange} placeholder="Password *" required />
                <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {validationErrors.patientPassword && <div className="invalid-feedback">{validationErrors.patientPassword}</div>}
            </div>
            {/* Address Field */}
            <div className="mb-3">
              <textarea className={`form-control ${validationErrors.patientAddress ? 'is-invalid' : ''}`} name="hospitalStaffAddress" value={patientData.patientAddress} onChange={handleInputChange} placeholder="Address *" required></textarea>
              {validationErrors.patientAddress && <div className="invalid-feedback">{validationErrors.patientAddress}</div>}
            </div>
            {/* ID Proof Image Upload */}
            <div className="mb-3">
              <button type="button" className={`btn ${validationErrors.patientIdProofImage ? 'btn-danger' : 'btn-outline-primary'} w-100`} onClick={() => fileInputIdProofRef.current.click()} style={{ marginBottom: '5px' }}>
                {patientData.patientIdProofImage ? patientData.patientIdProofImage.name : 'ID Proof Image'}
              </button>
              <input ref={fileInputIdProofRef} type="file" className={`form-control-file ${validationErrors.patientIdProofImage ? 'is-invalid' : ''}`} name="hospitalStaffIdProofImage" onChange={handleImageUpload('hospitalStaffIdProofImage')} accept=".jpg, .jpeg, .png" style={{ display: 'none' }} />
              {validationErrors.patientIdProofImage && <div className="invalid-feedback">{validationErrors.patientIdProofImage}</div>}
            </div>
            {/* Profile Image Upload */}
            <div className="mb-3">
              <button type="button" className={`btn ${validationErrors.patientProfileImage ? 'btn-danger' : 'btn-outline-primary'} w-100`} onClick={() => fileInputProfileRef.current.click()} style={{ marginBottom: '5px' }}>
                {patientData.patientProfileImage ? patientData.patientProfileImage.name : 'Profile Image'}
              </button>
              <input ref={fileInputProfileRef} type="file" className={`form-control-file ${validationErrors.patientProfileImage ? 'is-invalid' : ''}`} name="hospitalStaffProfileImage" onChange={handleImageUpload('hospitalStaffProfileImage')} accept=".jpg, .jpeg, .png" style={{ display: 'none' }} />
              {validationErrors.patientProfileImage && <div className="invalid-feedback">{validationErrors.patientProfileImage}</div>}
            </div>
            {/* Submit Button */}
            <div className="text-center mt-4">
              <button type="submit" className={`btn ${submitFailed ? 'btn-danger' : 'btn-success'}`} disabled={isLoading}>{isLoading ? 'Submitting...' : 'Register'}</button>
            </div>
            {submitFailed && <div className="text-danger mt-3">Registration failed. Please try again.</div>}
          </form>

        </div>
      </div>
    </div>
  </div>

  {/* Footer Component */}
  <div className="row">
    <div className="col">
      <Footer />
    </div>
  </div>
</div>





    );
};

export default HospitalStaffRegisterPatient;
