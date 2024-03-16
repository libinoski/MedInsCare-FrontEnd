import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
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
                    navigate('/hospitalStaffViewAllPatients');
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
<div className="d-flex flex-column min-vh-100" style={{
    background: 'linear-gradient(180deg, #00B4D8 0%, #0077B6 100%)', 
}}>
  {/* Navbar Component */}
  <HospitalStaffNavbar />

  {/* Registration Card */}
  <div className="row justify-content-center align-items-center flex-grow-1">
  <div className="col-lg-8 col-md-10 col-sm-12">
      <div className="card shadow-lg p-4">

        <div className="card-body">
          {/* Registration Form */}
          <form onSubmit={handleSubmit} noValidate>
            {/* Name Field */}
            <div className="mb-3">
              <input type="text" className={`form-control ${validationErrors.patientName ? 'is-invalid' : ''}`} name="patientName" value={patientData.patientName} onChange={handleInputChange} placeholder="Name *" required />
              {validationErrors.patientName && <div className="invalid-feedback">{validationErrors.patientName}</div>}
            </div>

            {/* Admitted Ward Field */}
            <div className="mb-3">
              <select className={`form-select ${validationErrors.admittedWard ? 'is-invalid' : ''}`} name="admittedWard" value={patientData.admittedWard} onChange={handleInputChange} required>
                <option value="">Select Admitted Ward *</option>
                <option value="ward1">Ward 1</option>
                <option value="ward2">Ward 2</option>
                {/* Add more options for other wards if needed */}
              </select>
              {validationErrors.admittedWard && <div className="invalid-feedback">{validationErrors.admittedWard}</div>}
            </div>

            {/* Diagnosis or Disease Type Field */}
            <div className="mb-3">
              <select className={`form-select ${validationErrors.diagnosisOrDiseaseType ? 'is-invalid' : ''}`} name="diagnosisOrDiseaseType" value={patientData.diagnosisOrDiseaseType} onChange={handleInputChange} required>
                <option value="">Select Diagnosis or Disease Type *</option>
                <option value="diagnosis1">Diagnosis 1</option>
                <option value="diagnosis2">Diagnosis 2</option>
                {/* Add more options for other diagnoses or diseases if needed */}
              </select>
              {validationErrors.diagnosisOrDiseaseType && <div className="invalid-feedback">{validationErrors.diagnosisOrDiseaseType}</div>}
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

            {/* Age Field */}
            <div className="mb-3">
              <input type="text" className={`form-control ${validationErrors.patientAge ? 'is-invalid' : ''}`} name="patientAge" value={patientData.patientAge} onChange={handleInputChange} placeholder="Age *" required />
              {validationErrors.patientAge && <div className="invalid-feedback">{validationErrors.patientAge}</div>}
            </div>

            {/* Mobile Number Field */}
            <div className="mb-3">
              <input type="tel" className={`form-control ${validationErrors.patientMobile ? 'is-invalid' : ''}`} name="patientMobile" value={patientData.patientMobile} onChange={handleInputChange} placeholder="Mobile Number *" required />
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
              <textarea className={`form-control ${validationErrors.patientAddress ? 'is-invalid' : ''}`} name="patientAddress" value={patientData.patientAddress} onChange={handleInputChange} placeholder="Address *" required></textarea>
              {validationErrors.patientAddress && <div className="invalid-feedback">{validationErrors.patientAddress}</div>}
            </div>

            {/* Gender Field */}
            <div className="mb-3">
              <select className={`form-select ${validationErrors.patientGender ? 'is-invalid' : ''}`} name="patientGender" value={patientData.patientGender} onChange={handleInputChange} required>
                <option value="">Select Gender *</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              {validationErrors.patientGender && <div className="invalid-feedback">{validationErrors.patientGender}</div>}
            </div>

 {/* ID Proof Image Upload */}
<div className="mb-3">
    <button 
        type="button" 
        className={`btn mx-2 btn-outline-secondary text-dark`} 
        onClick={() => fileInputIdProofRef.current.click()} 
        style={{
            border: '2px solid #6c757d',
            color: '#6c757d',
            fontWeight: 'bold',
            padding: '10px 20px',
            borderRadius: '25px',
            width: '100%', // Adapted to full width
            marginBottom: '5px'
        }}
    >
        {patientData.patientIdProofImage ? patientData.patientIdProofImage.name : 'ID Proof Image'}
    </button>
    <input 
        ref={fileInputIdProofRef} 
        type="file" 
        className={`form-control-file ${validationErrors.patientIdProofImage ? 'is-invalid' : ''}`} 
        name="patientIdProofImage" 
        onChange={handleImageUpload('patientIdProofImage')} 
        accept=".jpg, .jpeg, .png" 
        style={{ display: 'none' }} 
    />
    {validationErrors.patientIdProofImage && <div className="invalid-feedback">{validationErrors.patientIdProofImage}</div>}
</div>

{/* Profile Image Upload */}
<div className="mb-3">
    <button 
        type="button" 
        className={`btn mx-2 btn-outline-secondary text-dark`} 
        onClick={() => fileInputProfileRef.current.click()} 
        style={{
            border: '2px solid #6c757d',
            color: '#6c757d',
            fontWeight: 'bold',
            padding: '10px 20px',
            borderRadius: '25px',
            width: '100%', // Adapted to full width
            marginBottom: '5px'
        }}
    >
        {patientData.patientProfileImage ? patientData.patientProfileImage.name : 'Profile Image'}
    </button>
    <input 
        ref={fileInputProfileRef} 
        type="file" 
        className={`form-control-file ${validationErrors.patientProfileImage ? 'is-invalid' : ''}`} 
        name="patientProfileImage" 
        onChange={handleImageUpload('patientProfileImage')} 
        accept=".jpg, .jpeg, .png" 
        style={{ display: 'none' }} 
    />
    {validationErrors.patientProfileImage && <div className="invalid-feedback">{validationErrors.patientProfileImage}</div>}
</div>

{/* Submit Button */}
<div className="text-center mt-4">
    <button 
        type="submit" 
        className={`btn mx-2 btn-outline-secondary text-dark }`} 
        disabled={isLoading} 
        style={{
            border: '2px solid #6c757d',
            color: '#6c757d',
            fontWeight: 'bold',
            padding: '10px 20px',
            borderRadius: '25px',
            width: 'auto'
        }}
    >
        {isLoading ? 'Submitting...' : 'Register'}
    </button>
</div>

            {submitFailed && <div className="text-danger mt-3">Registration failed. Please try again.</div>}
          </form>

        </div>
      </div>
    </div>
  </div>

      <Footer />
    </div>





    );
};

export default HospitalStaffRegisterPatient;
