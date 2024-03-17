import React, { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import backgroundImage from '../../images/Hospital/hospital.jpeg'; // Import the background image
import Footer from '../Common/Footer';
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

    const navigate = useNavigate();
    const [hospitalData, setHospitalData] = useState(initialHospitalData);
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const fileInputRef = useRef(null);
    const [submitFailed, setSubmitFailed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Define navigateToLogin function
    const navigateToLogin = () => {
        navigate('/hospitalLogin'); // Change '/hospitalLogin' to the path you use for your hospital login page
    };

    const resetForm = () => {
        setHospitalData(initialHospitalData);
        setValidationErrors({});
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        setSubmitFailed(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setValidationErrors({});


        try {
            const formData = new FormData();
            for (const [key, value] of Object.entries(hospitalData)) {
                formData.append(key, value);
            }


            const response = await axios.post('http://localhost:1313/api/mic/hospital/hospitalRegistration', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            switch (response.status) {
                case 200:
                    alert(response.data.message || 'Hospital registered successfully');
                    resetForm();
                    navigate('/hospitalLogin');
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
        setHospitalData({ ...hospitalData, [name]: value });
        if (validationErrors[name]) {
            setValidationErrors({ ...validationErrors, [name]: '' });
        }
    };

    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        setHospitalData({ ...hospitalData, hospitalImage: file });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

<nav className="navbar navbar-expand-lg navbar-light bg-white">
    <div className="container-fluid">
        <span className="navbar-brand mb-0 h1 text-dark d-block mx-auto font-weight-bold" style={{ fontFamily: 'Arial, sans-serif' }}>MedInsCare Hospital Registration</span>
        <Link to="/" className="btn btn-outline-secondary rounded-pill" style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>
            Home
        </Link>
    </div>
</nav>


            <div className="row">
                {/* Left Side Image Container */}
                <div className="col-lg-6">
                    <div className="d-flex align-items-center justify-content-center" style={{ height: '100%', minHeight: '100vh' }}>
                        <img src={backgroundImage} className="img-fluid" alt="Background" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    </div>
                </div>


                {/* Right Side Registration Card */}
                <div className="col-lg-6 d-flex align-items-center justify-content-center">
                    <div className="card shadow-lg p-4" style={{ width: '90%' }}>
                        <div className="card-body">
                            <h1 className="text-center mb-4">Hospital Registration</h1>
                            {/* Registration Form */}
                            <form onSubmit={handleSubmit} noValidate>
                                {/* Name Field */}
                                <div className="mb-3">
                                    <input type="text" className={`form-control ${validationErrors.hospitalName ? 'is-invalid' : ''}`} name="hospitalName" value={hospitalData.hospitalName} onChange={handleInputChange} placeholder="Name *" required />
                                    {validationErrors.hospitalName && <div className="invalid-feedback">{validationErrors.hospitalName}</div>}
                                </div>
                                {/* Email Field */}
                                <div className="mb-3">
                                    <input type="email" className={`form-control ${validationErrors.hospitalEmail ? 'is-invalid' : ''}`} name="hospitalEmail" value={hospitalData.hospitalEmail} onChange={handleInputChange} placeholder="Email *" required />
                                    {validationErrors.hospitalEmail && <div className="invalid-feedback">{validationErrors.hospitalEmail}</div>}
                                </div>
                                {/* Aadhar Number Field */}
                                <div className="mb-3">
                                    <input type="text" className={`form-control ${validationErrors.hospitalAadhar ? 'is-invalid' : ''}`} name="hospitalAadhar" value={hospitalData.hospitalAadhar} onChange={handleInputChange} placeholder="Aadhar Number *" required />
                                    {validationErrors.hospitalAadhar && <div className="invalid-feedback">{validationErrors.hospitalAadhar}</div>}
                                </div>
                                {/* Mobile Number Field */}
                                <div className="mb-3">
                                    <input type="tel" className={`form-control ${validationErrors.hospitalMobile ? 'is-invalid' : ''}`} name="hospitalMobile" value={hospitalData.hospitalMobile} onChange={handleInputChange} placeholder="Mobile Number *" required />
                                    {validationErrors.hospitalMobile && <div className="invalid-feedback">{validationErrors.hospitalMobile}</div>}
                                </div>
                                {/* Hospital Website Field */}
                                <div className="mb-3">
                                    <input type="text" className={`form-control ${validationErrors.hospitalWebSite ? 'is-invalid' : ''}`} name="hospitalWebSite" value={hospitalData.hospitalWebSite} onChange={handleInputChange} placeholder="Website" />
                                    {validationErrors.hospitalWebSite && <div className="invalid-feedback">{validationErrors.hospitalWebSite}</div>}
                                </div>
                                {/* Address Field */}
                                <div className="mb-3">
                                    <input
                                        type="text"
                                        className={`form-control ${validationErrors.hospitalAddress ? 'is-invalid' : ''}`}
                                        name="hospitalAddress"
                                        value={hospitalData.hospitalAddress}
                                        onChange={handleInputChange}
                                        placeholder="Address *"
                                        required
                                    />
                                    {validationErrors.hospitalAddress && <div className="invalid-feedback">{validationErrors.hospitalAddress}</div>}
                                </div>

                                {/* Password Field */}
                                <div className="mb-3">
                                    <div className={`input-group ${validationErrors.hospitalPassword ? 'is-invalid' : ''}`}>
                                        <input type={showPassword ? "text" : "password"} className="form-control" name="hospitalPassword" value={hospitalData.hospitalPassword} onChange={handleInputChange} placeholder="Password *" required />
                                        <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                    {validationErrors.hospitalPassword && <div className="invalid-feedback">{validationErrors.hospitalPassword}</div>}
                                </div>
                                {/* Hospital Image Upload */}
                                <div className="mb-3">
                                    <button type="button" className={`btn ${validationErrors.hospitalImage ? 'btn-danger' : 'btn-outline-primary'} w-100`} onClick={() => fileInputRef.current.click()} style={{ marginBottom: '5px' }}>
                                        {hospitalData.hospitalImage ? hospitalData.hospitalImage.name : 'Upload Hospital Image'}
                                    </button>
                                    <input ref={fileInputRef} type="file" className={`form-control-file ${validationErrors.hospitalImage ? 'is-invalid' : ''}`} name="hospitalImage" onChange={handleImageUpload} accept=".jpg, .jpeg, .png" style={{ display: 'none' }} />
                                    {validationErrors.hospitalImage && <div className="invalid-feedback">{validationErrors.hospitalImage}</div>}
                                </div>

                                <div className="text-center mt-4">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className={`btn ${submitFailed ? 'btn-danger' : ''} rounded-pill`}
                                        style={{
                                            width: '100%',
                                            padding: '10px 0',
                                            fontSize: '1rem',
                                            cursor: isLoading ? 'not-allowed' : 'pointer',
                                            color: '#fff',
                                            border: 'none',
                                            outline: 'none',
                                            background: submitFailed ? '' : 'linear-gradient(to right, #56ab2f, #a8e063)', // Green gradient for success
                                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                            transition: 'all 0.3s ease',
                                        }}
                                    >
                                        {isLoading ? 'Submitting...' : 'Register'}
                                    </button>
                                </div>

                                {submitFailed && <div className="text-danger mt-3">Registration failed. Please try again.</div>}
                            </form>
                            {/* Add Login Button */}
                            <div className="text-center mt-2">
                                <button
                                    type="button"
                                    onClick={navigateToLogin}
                                    className="btn" // Simplified class name
                                    style={{
                                        padding: '10px 20px', // Adjust padding
                                        fontSize: '16px', // Adjust font size
                                        letterSpacing: '1px', // Add letter spacing
                                        background: 'linear-gradient(to right, #007bff, #4c9cf1)', // Updated gradient colors
                                        border: 'none', // No border
                                        color: 'white', // Text color
                                        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Shadow for depth
                                        transition: 'all 0.3s ease', // Smooth transition for mouse events
                                        cursor: 'pointer', // Pointer on hover
                                        width: '100%', // Maintain full width
                                    }}
                                    onMouseOver={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #0062cc, #6699ff)'} // Darker gradient on hover
                                    onMouseOut={(e) => e.currentTarget.style.background = 'linear-gradient(to right, #007bff, #4c9cf1)'} // Original gradient on mouse out
                                >
                                    Already have an account? Login
                                </button>
                            </div>


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

export default HospitalRegistration;
