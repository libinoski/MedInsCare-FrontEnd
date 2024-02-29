import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../../images/Hospital/bg1.jpg';
import Footer from '../Common/Footer';
import HospitalStaffNavbar from './HospitalStaffNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

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
    const fileInputIdProofRef = useRef(null);
    const fileInputProfileRef = useRef(null);
    const [submitFailed, setSubmitFailed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

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
                    navigate('/hospitalViewProfile');
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

    const handleImageUpload = (fileType) => (event) => {
        const file = event.target.files[0];
        setPatientData({ ...patientData, [fileType]: file });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div>
            <HospitalStaffNavbar />
            <div className="container-fluid d-flex justify-content-center align-items-center" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: 'calc(100vh - 56px)', paddingTop: '56px', position: 'relative', paddingBottom: '56px' }}>
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-body">
                                    <h1 className="text-center mb-4">Patient Registration</h1>
                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <input type="text" className={`form-control ${validationErrors.patientName ? 'is-invalid' : ''}`} name="patientName" value={patientData.patientName} onChange={handleInputChange} placeholder="Name *" required />
                                                {validationErrors.patientName && <div className="invalid-feedback">{validationErrors.patientName}</div>}
                                            </div>
                                            <div className="col-md-6">
                                                <input type="email" className={`form-control ${validationErrors.patientEmail ? 'is-invalid' : ''}`} name="patientEmail" value={patientData.patientEmail} onChange={handleInputChange} placeholder="Email *" required />
                                                {validationErrors.patientEmail && <div className="invalid-feedback">{validationErrors.patientEmail}</div>}
                                            </div>
                                            <div className="col-md-6">
                                                <input type="text" className={`form-control ${validationErrors.patientAadhar ? 'is-invalid' : ''}`} name="patientAadhar" value={patientData.patientAadhar} onChange={handleInputChange} placeholder="Aadhar *" required />
                                                {validationErrors.patientAadhar && <div className="invalid-feedback">{validationErrors.patientAadhar}</div>}
                                            </div>
                                            <div className="col-md-6">
                                                <input type="text" className={`form-control ${validationErrors.patientMobile ? 'is-invalid' : ''}`} name="patientMobile" value={patientData.patientMobile} onChange={handleInputChange} placeholder="Mobile *" required />
                                                {validationErrors.patientMobile && <div className="invalid-feedback">{validationErrors.patientMobile}</div>}
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-group">
                                                    <input type={showPassword ? 'text' : 'password'} className={`form-control ${validationErrors.patientPassword ? 'is-invalid' : ''}`} name="patientPassword" value={patientData.patientPassword} onChange={handleInputChange} placeholder="Password *" required />
                                                    <button className="btn btn-outline-secondary" type="button" onClick={togglePasswordVisibility}>
                                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                    </button>
                                                </div>
                                                {validationErrors.patientPassword && <div className="invalid-feedback d-block">{validationErrors.patientPassword}</div>}
                                            </div>
                                            <div className="col-md-6">
                                                <select className={`form-select ${validationErrors.patientGender ? 'is-invalid' : ''}`} name="patientGender" value={patientData.patientGender} onChange={handleInputChange} required>
                                                    <option value="">Select Gender *</option>
                                                    <option value="Male">Male</option>
                                                    <option value="Female">Female</option>
                                                    <option value="Other">Other</option>
                                                </select>
                                                {validationErrors.patientGender && <div className="invalid-feedback">{validationErrors.patientGender}</div>}
                                            </div>
                                            <div className="col-md-6">
                                                <input type="number" className={`form-control ${validationErrors.patientAge ? 'is-invalid' : ''}`} name="patientAge" value={patientData.patientAge} onChange={handleInputChange} placeholder="Age *" required />
                                                {validationErrors.patientAge && <div className="invalid-feedback">{validationErrors.patientAge}</div>}
                                            </div>
                                            <div className="col-12">
                                                <textarea className={`form-control ${validationErrors.patientAddress ? 'is-invalid' : ''}`} name="patientAddress" value={patientData.patientAddress} onChange={handleInputChange} placeholder="Address *" required />
                                                {validationErrors.patientAddress && <div className="invalid-feedback">{validationErrors.patientAddress}</div>}
                                            </div>
                                            <div className="col-12">
                                                <input type="file" ref={fileInputIdProofRef} className={`form-control ${validationErrors.patientIdProofImage ? 'is-invalid' : ''}`} name="patientIdProofImage" onChange={handleImageUpload('patientIdProofImage')} accept="image/*" required />
                                                {validationErrors.patientIdProofImage && <div className="invalid-feedback">{validationErrors.patientIdProofImage}</div>}
                                                <label htmlFor="patientIdProofImage" className="form-label">Upload ID Proof Image *</label>
                                            </div>
                                            <div className="col-12">
                                                <input type="file" ref={fileInputProfileRef} className={`form-control ${validationErrors.patientProfileImage ? 'is-invalid' : ''}`} name="patientProfileImage" onChange={handleImageUpload('patientProfileImage')} accept="image/*" required />
                                                {validationErrors.patientProfileImage && <div className="invalid-feedback">{validationErrors.patientProfileImage}</div>}
                                                <label htmlFor="patientProfileImage" className="form-label">Upload Profile Image *</label>
                                            </div>
                                            <div className="col-12 text-center">
    <button type="submit" className={`btn btn-primary ${submitFailed ? 'btn-danger' : ''}`} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Register'}
    </button>
</div>

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

export default HospitalStaffRegisterPatient;
