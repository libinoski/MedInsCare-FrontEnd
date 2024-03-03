import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/Hospital/hr.jpg'; // Import the background image
import { useNavigate } from 'react-router-dom';

const InsuranceProviderRegistration = () => {
    const initialInsuranceProviderData = {
        insuranceProviderName: '',
        insuranceProviderEmail: '',
        insuranceProviderAadhar: '',
        insuranceProviderMobile: '',
        insuranceProviderProfileImage: null,
        insuranceProviderIdProofImage: null,
        insuranceProviderAddress: '',
        insuranceProviderPassword: '',
    };

    const [hospitals, setHospitals] = useState([]);
    const [selectedHospital, setSelectedHospital] = useState('');
    const [insuranceProviderData, setInsuranceProviderData] = useState(initialInsuranceProviderData);
    const [validationErrors, setValidationErrors] = useState({});
    const [submitFailed, setSubmitFailed] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [profileImageFileName, setProfileImageFileName] = useState('');
    const [idProofImageFileName, setIdProofImageFileName] = useState('');
    const formRef = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        fetchHospitals();
    }, []);

    const fetchHospitals = async () => {
        try {
            const response = await axios.post('http://localhost:1313/api/mic/insuranceProvider/insuranceProviderViewAllHospitals');
            setHospitals(response.data.data);
        } catch (error) {
            console.error('Error fetching hospitals:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInsuranceProviderData({ ...insuranceProviderData, [name]: value });
    };

    const handleHospitalChange = (hospitalId) => {
        setSelectedHospital(hospitalId);
    };

    const handleProfileImageUpload = (e) => {
        const file = e.target.files[0];
        setInsuranceProviderData({ ...insuranceProviderData, insuranceProviderProfileImage: file });
        setProfileImageFileName(file.name);
    };

    const handleIdProofImageUpload = (e) => {
        const file = e.target.files[0];
        setInsuranceProviderData({ ...insuranceProviderData, insuranceProviderIdProofImage: file });
        setIdProofImageFileName(file.name);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setValidationErrors({});
        setSubmitFailed(false);

        try {
            const formData = new FormData();
            Object.entries(insuranceProviderData).forEach(([key, value]) => {
                formData.append(key, value);
            });
            formData.append('hospitalId', selectedHospital);

            const response = await axios.post('http://localhost:1313/api/mic/insuranceProvider/insuranceProviderRegister', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            switch (response.status) {
                case 200:
                    alert(response.data.message || 'Insurance provider registered successfully');
                    resetForm();
                    setSelectedHospital('');
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
                        const validationErrors400 = data.results || {};
                        setValidationErrors(validationErrors400);
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
                        alert(data.message || 'An error occurred. Please try again.');
                        break;
                }
            } else {
                alert('An error occurred. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const resetForm = () => {
        setInsuranceProviderData(initialInsuranceProviderData);
        setValidationErrors({});
        formRef.current.reset();
        setProfileImageFileName('');
        setIdProofImageFileName('');

    };

    const handleAlreadyHaveAccount = () => {
        navigate('/insuranceProviderLogin');
    };

    return (
        <div>
            {/* <Navbar /> */}
            <div className="container-fluid">
        <div className="row align-items-center justify-content-center" style={{ minHeight: '100vh' }}> {/* Updated: Added minHeight: '100vh' to ensure the row fills the screen height */}

                    {/* Background Image Column */}
                    <div className="col-lg-6" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', minHeight: '100vh' }}>
                    </div>
                    {/* Registration Card Column */}
                    <div className="col-lg-6 d-flex align-items-center justify-content-center" style={{ minHeight: '100vh' }}> {/* Updated: Added minHeight: '100vh' to ensure the column fills the screen height */}
                <div className="card shadow-lg p-4" style={{ width: '100%', maxWidth: '90%', minHeight: '100%', backdropFilter: 'blur(8px)', backgroundColor: 'rgba(255, 255, 255, 0.7)', borderRadius: '20px', boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)', position: 'relative' }}> {/* Updated: Added width: '100%' and minHeight: '100%' */}
                            {/* Card Body */}
                            <div className="card-body">
                                {/* Your form elements go here... */}
                                <div className="text-center mb-3">
                                    {submitFailed && <div className="text-danger">Registration failed. Please try again.</div>}
                                </div>
                                <form onSubmit={handleSubmit} noValidate className="needs-validation">
                                    {/* Name Field */}
                                    <div className="mb-3">
                                        <input type="text" className={`form-control ${validationErrors.insuranceProviderName ? 'is-invalid' : ''}`} id="insuranceProviderName" name="insuranceProviderName" placeholder="Name *" value={insuranceProviderData.insuranceProviderName} onChange={handleInputChange} required />
                                        {validationErrors.insuranceProviderName && <div className="invalid-feedback">{validationErrors.insuranceProviderName}</div>}
                                    </div>
                                    {/* Email Field */}
                                    <div className="mb-3">
                                        <input type="email" className={`form-control ${validationErrors.insuranceProviderEmail ? 'is-invalid' : ''}`} id="insuranceProviderEmail" name="insuranceProviderEmail" placeholder="Email *" value={insuranceProviderData.insuranceProviderEmail} onChange={handleInputChange} required />
                                        {validationErrors.insuranceProviderEmail && <div className="invalid-feedback">{validationErrors.insuranceProviderEmail}</div>}
                                    </div>
                                    {/* Aadhar Number Field */}
                                    <div className="mb-3">
                                        <input type="text" className={`form-control ${validationErrors.insuranceProviderAadhar ? 'is-invalid' : ''}`} id="insuranceProviderAadhar" name="insuranceProviderAadhar" placeholder="Aadhar Number *" value={insuranceProviderData.insuranceProviderAadhar} onChange={handleInputChange} required />
                                        {validationErrors.insuranceProviderAadhar && <div className="invalid-feedback">{validationErrors.insuranceProviderAadhar}</div>}
                                    </div>
                                    {/* Mobile Number Field */}
                                    <div className="mb-3">
                                        <input type="tel" className={`form-control ${validationErrors.insuranceProviderMobile ? 'is-invalid' : ''}`} id="insuranceProviderMobile" name="insuranceProviderMobile" placeholder="Mobile Number *" value={insuranceProviderData.insuranceProviderMobile} onChange={handleInputChange} required />
                                        {validationErrors.insuranceProviderMobile && <div className="invalid-feedback">{validationErrors.insuranceProviderMobile}</div>}
                                    </div>
                                    {/* Profile Image Upload */}
                                    <div className="mb-3">
                                        <input type="file" id="insuranceProviderProfileImage" name="insuranceProviderProfileImage" onChange={handleProfileImageUpload} style={{ display: 'none' }} accept=".jpg, .jpeg, .png" required />
                                        <label htmlFor="insuranceProviderProfileImage" className={`btn w-100`} style={{
                                            marginBottom: '5px',
                                            backgroundImage: 'linear-gradient(to right, #6a11cb, #2575fc)',
                                            color: 'white',
                                            boxShadow: '0 4px 6px rgba(0,0,0,.1)',
                                            borderRadius: '20px',
                                            border: 'none'
                                        }}>
                                            Upload Profile Image
                                        </label>
                                        {profileImageFileName && <div>Selected profile image file: {profileImageFileName}</div>}
                                        {validationErrors.insuranceProviderProfileImage && <div className="text-danger">{validationErrors.insuranceProviderProfileImage}</div>}
                                    </div>
                                    {/* ID Proof Image Upload */}
                                    <div className="mb-3">
                                        <input type="file" id="insuranceProviderIdProofImage" name="insuranceProviderIdProofImage" onChange={handleIdProofImageUpload} style={{ display: 'none' }} accept=".jpg, .jpeg, .png" required />
                                        <label htmlFor="insuranceProviderIdProofImage" className={`btn w-100`} style={{
                                            marginBottom: '5px',
                                            backgroundImage: 'linear-gradient(to right, #ff4b1f, #ff9068)',
                                            color: 'white',
                                            boxShadow: '0 4px 6px rgba(0,0,0,.1)',
                                            borderRadius: '20px',
                                            border: 'none'
                                        }}>
                                            Upload ID Proof Image
                                        </label>
                                        {idProofImageFileName && <div>Selected ID proof image file: {idProofImageFileName}</div>}
                                        {validationErrors.insuranceProviderIdProofImage && <div className="text-danger">{validationErrors.insuranceProviderIdProofImage}</div>}
                                    </div>
                                    {/* Password Field */}
                                    <div className="mb-3">
                                        <div className="input-group">
                                            <input type={showPassword ? "text" : "password"} className={`form-control ${validationErrors.insuranceProviderPassword ? 'is-invalid' : ''}`} id="insuranceProviderPassword" name="insuranceProviderPassword" placeholder="Password *" value={insuranceProviderData.insuranceProviderPassword} onChange={handleInputChange} required />
                                            <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                            </button>
                                        </div>
                                        {validationErrors.insuranceProviderPassword && <div className="invalid-feedback" style={{ display: 'block' }}>{validationErrors.insuranceProviderPassword}</div>}
                                    </div>

                                    {/* Hospital Dropdown */}
                                    <div className="mb-3 position-relative">
                                        <div className="dropdown" style={{ position: 'relative', userSelect: 'none' }}>
                                            <button
                                                className="btn btn-outline-secondary dropdown-toggle"
                                                type="button"
                                                id="hospitalDropdown"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                                style={{
                                                    backgroundColor: '#f8f9fa',
                                                    borderColor: '#6c757d',
                                                    boxShadow: '0 0 0 0.25rem rgba(13, 110, 253, 0.25)',
                                                    transition: 'box-shadow 0.3s ease'
                                                }}
                                                onMouseOver={(e) => e.currentTarget.style.boxShadow = '0 0 0 0.4rem rgba(13, 110, 253, 0.25)'}
                                                onMouseOut={(e) => e.currentTarget.style.boxShadow = '0 0 0 0.25rem rgba(13, 110, 253, 0.25)'}
                                            >
                                                {selectedHospital ? hospitals.find(h => h.hospitalId === selectedHospital)?.hospitalName : "Select Hospital"}
                                            </button>
                                            <ul
                                                className="dropdown-menu"
                                                aria-labelledby="hospitalDropdown"
                                                style={{
                                                    marginTop: '0.5rem',
                                                    backgroundColor: '#fff',
                                                    boxShadow: '0 4px 6px rgba(0,0,0,.1)',
                                                    borderRadius: '0.25rem',
                                                    overflowY: 'scroll', // Make Y-axis scrollable
                                                    maxHeight: '200px', // Set a maximum height
                                                    transition: 'opacity 0.3s ease',
                                                    opacity: 1
                                                }}
                                            >
                                                {hospitals.map(hospital => (
                                                    <li key={hospital.hospitalId}>
                                                        <button
                                                            className="dropdown-item d-flex align-items-center"
                                                            type="button"
                                                            onClick={() => handleHospitalChange(hospital.hospitalId)}
                                                            style={{
                                                                transition: 'background-color 0.2s ease-in-out'
                                                            }}
                                                            onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f0f0f0'}
                                                            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                                        >
                                                            <img src={hospital.hospitalImage} alt="Hospital Profile" className="rounded-circle me-2" style={{ width: '30px', height: '30px', objectFit: 'cover' }} />
                                                            <span>{hospital.hospitalName}</span>
                                                        </button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        {validationErrors.selectedHospital && <div className="invalid-feedback">{validationErrors.selectedHospital}</div>}
                                    </div>

                                    {/* Register Button */}
                                    <div className="mb-3 d-flex justify-content-end">
                                        <button type="submit" className={`btn ${submitFailed ? 'btn-danger' : 'btn-success'}`} disabled={isLoading}>
                                            {isLoading ? 'Submitting...' : 'Register'}
                                        </button>
                                    </div>

                                    {/* Login Button */}
                                    <div className="mb-3 d-flex justify-content-end">
                                        <button
                                            type="button"
                                            className="btn btn-outline-primary"
                                            onClick={handleAlreadyHaveAccount}
                                            style={{
                                                padding: '10px 20px',
                                                fontSize: '16px',
                                                letterSpacing: '1px',
                                                background: 'linear-gradient(to right, #007bff, #4c9cf1)',
                                                border: 'none',
                                                color: 'white',
                                                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            Login
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>



    );
};

export default InsuranceProviderRegistration;
