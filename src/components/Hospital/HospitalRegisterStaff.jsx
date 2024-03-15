import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import backgroundImage from '../../images/Hospital/hospital.svg'; // Import the background image
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

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
    const [submitFailed, setSubmitFailed] = useState(false);

    const resetForm = () => {
        setStaffData(initialStaffData);
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
                    navigate('/hospitalViewAllStaffs');
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
        setStaffData({ ...staffData, [name]: value });
        if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: '' });
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleImageUpload = (fileType) => (event) => {
        const file = event.target.files[0];
        setStaffData({ ...staffData, [fileType]: file });
    };

    return (
        
        <div>
        {/* Navbar Component */}
        <Navbar />
  
        {/* Main Content Container */}
        <div className="container">
          <div className="row">
            {/* Left Side Image Container */}
            <div className="col-lg-6">
  <div className="d-flex align-items-center justify-content-center" style={{ height: '100vh' }}>
    <img src={backgroundImage} className="img-fluid" alt="Background" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
  </div>
</div>


  
            {/* Right Side Registration Card */}
            <div className="col-lg-6 d-flex align-items-center justify-content-center">
              <div className="card shadow-lg p-4" style={{ width: '90%' }}>
                <div className="card-body">
                  {/* Registration Form */}
                  <form onSubmit={handleSubmit} noValidate>
                    {/* Name Field */}
                    <div className="mb-3">
                      <input type="text" className={`form-control ${validationErrors.hospitalStaffName ? 'is-invalid' : ''}`} name="hospitalStaffName" value={staffData.hospitalStaffName} onChange={handleInputChange} placeholder="Name *" required />
                      {validationErrors.hospitalStaffName && <div className="invalid-feedback">{validationErrors.hospitalStaffName}</div>}
                    </div>
  
                    {/* Email Field */}
                    <div className="mb-3">
                      <input type="email" className={`form-control ${validationErrors.hospitalStaffEmail ? 'is-invalid' : ''}`} name="hospitalStaffEmail" value={staffData.hospitalStaffEmail} onChange={handleInputChange} placeholder="Email *" required />
                      {validationErrors.hospitalStaffEmail && <div className="invalid-feedback">{validationErrors.hospitalStaffEmail}</div>}
                    </div>
  
                    {/* Aadhar Number Field */}
                    <div className="mb-3">
                      <input type="text" className={`form-control ${validationErrors.hospitalStaffAadhar ? 'is-invalid' : ''}`} name="hospitalStaffAadhar" value={staffData.hospitalStaffAadhar} onChange={handleInputChange} placeholder="Aadhar Number *" required />
                      {validationErrors.hospitalStaffAadhar && <div className="invalid-feedback">{validationErrors.hospitalStaffAadhar}</div>}
                    </div>
  
                    {/* Mobile Number Field */}
                    <div className="mb-3">
                      <input type="tel" className={`form-control ${validationErrors.hospitalStaffMobile ? 'is-invalid' : ''}`} name="hospitalStaffMobile" value={staffData.hospitalStaffMobile} onChange={handleInputChange} placeholder="Mobile Number *" required />
                      {validationErrors.hospitalStaffMobile && <div className="invalid-feedback">{validationErrors.hospitalStaffMobile}</div>}
                    </div>
  
                    {/* Password Field */}
            {/* Password Field */}
            <div className="mb-3">
              <div className={`input-group ${validationErrors.hospitalStaffPassword ? 'is-invalid' : ''}`}>
                <input type={showPassword ? "text" : "password"} className="form-control" name="hospitalStaffPassword" value={staffData.hospitalStaffPassword} onChange={handleInputChange} placeholder="Password *" required />
                <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </button>
              </div>
              {validationErrors.hospitalStaffPassword && <div className="invalid-feedback">{validationErrors.hospitalStaffPassword}</div>}
            </div>

  
                    {/* Address Field */}
                    <div className="mb-3">
                      <textarea className={`form-control ${validationErrors.hospitalStaffAddress ? 'is-invalid' : ''}`} name="hospitalStaffAddress" value={staffData.hospitalStaffAddress} onChange={handleInputChange} placeholder="Address *" required></textarea>
                      {validationErrors.hospitalStaffAddress && <div className="invalid-feedback">{validationErrors.hospitalStaffAddress}</div>}
                    </div>
  
                    {/* ID Proof Image Upload */}
                    <div className="mb-3">
                      <button type="button" className={`btn ${validationErrors.hospitalStaffIdProofImage ? 'btn-danger' : 'btn-outline-primary'} w-100`} onClick={() => fileInputIdProofRef.current.click()} style={{ marginBottom: '5px' }}>
                        {staffData.hospitalStaffIdProofImage ? staffData.hospitalStaffIdProofImage.name : 'ID Proof Image'}
                      </button>
                      <input ref={fileInputIdProofRef} type="file" className={`form-control-file ${validationErrors.hospitalStaffIdProofImage ? 'is-invalid' : ''}`} name="hospitalStaffIdProofImage" onChange={handleImageUpload('hospitalStaffIdProofImage')} accept=".jpg, .jpeg, .png" style={{ display: 'none' }} />
                      {validationErrors.hospitalStaffIdProofImage && <div className="invalid-feedback">{validationErrors.hospitalStaffIdProofImage}</div>}
                    </div>
  
                    {/* Profile Image Upload */}
                    <div className="mb-3">
                      <button type="button" className={`btn ${validationErrors.hospitalStaffProfileImage ? 'btn-danger' : 'btn-outline-primary'} w-100`} onClick={() => fileInputProfileRef.current.click()} style={{ marginBottom: '5px' }}>
                        {staffData.hospitalStaffProfileImage ? staffData.hospitalStaffProfileImage.name : 'Profile Image'}
                      </button>
                      <input ref={fileInputProfileRef} type="file" className={`form-control-file ${validationErrors.hospitalStaffProfileImage ? 'is-invalid' : ''}`} name="hospitalStaffProfileImage" onChange={handleImageUpload('hospitalStaffProfileImage')} accept=".jpg, .jpeg, .png" style={{ display: 'none' }} />
                      {validationErrors.hospitalStaffProfileImage && <div className="invalid-feedback">{validationErrors.hospitalStaffProfileImage}</div>}
                    </div>
  
                    {/* Submit Button */}
                    <div className="text-center mt-4">
                      <button type="submit" className={`btn ${submitFailed ? 'btn-danger' : 'btn-success'}`} disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Register'}
                      </button>
                    </div>
                    {submitFailed && <div className="text-danger mt-3">Registration failed. Please try again.</div>}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
  
        {/* Footer Component */}
        <Footer />
      </div>
  




    );
};

export default HospitalRegisterStaff;
