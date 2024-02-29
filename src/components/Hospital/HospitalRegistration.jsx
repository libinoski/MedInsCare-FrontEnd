import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/Hospital/doc.jpg'; // Import the background image
import Navbar from './HospitalNavbar';

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
    const [submitFailed, setSubmitFailed] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [fileName, setFileName] = useState('');

    const resetForm = () => {
        setHospitalData(initialHospitalData);
        setValidationErrors({});
        setSubmitFailed(false); // Reset submitFailed state
        setFileName(''); // Reset fileName state
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setValidationErrors({});
        setSubmitFailed(false);

        try {
            const formData = new FormData();
            Object.entries(hospitalData).forEach(([key, value]) => {
                formData.append(key, value);
            });

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
                    case 400: // Handling validation errors
                        const validationErrors400 = data.results || {};
                        setValidationErrors(validationErrors400);
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setHospitalData({ ...hospitalData, [name]: value });
    };

    const handleAlreadyHaveAccount = () => {
        // Logic to handle "Already have an account" button click
        navigate('/hospitalLogin');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        setHospitalData({ ...hospitalData, hospitalImage: file });
        setFileName(file.name); // Set the file name
    };

    return (
        <div>
            <Navbar />
            <div
                className="container-fluid d-flex justify-content-center align-items-center"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: 'calc(100vh - 56px)',
                    paddingTop: '56px',
                    position: 'relative',
                    paddingBottom: '56px',
                }}
            >
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card">
                                <div className="card-body">
                                    <h1 className="text-center mb-4">Enroll Your Hospital Today: Join Our Network</h1>
                                    <form onSubmit={handleSubmit} noValidate>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    className={`form-control ${validationErrors.hospitalName ? 'is-invalid' : ''}`}
                                                    id="hospitalName"
                                                    name="hospitalName"
                                                    value={hospitalData.hospitalName}
                                                    onChange={handleChange}
                                                    placeholder="Hospital Name *"
                                                    required
                                                />
                                                {validationErrors.hospitalName && <div className="invalid-feedback">{validationErrors.hospitalName}</div>}
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="email"
                                                    className={`form-control ${validationErrors.hospitalEmail ? 'is-invalid' : ''}`}
                                                    id="hospitalEmail"
                                                    name="hospitalEmail"
                                                    value={hospitalData.hospitalEmail}
                                                    onChange={handleChange}
                                                    placeholder="Email *"
                                                    required
                                                />
                                                {validationErrors.hospitalEmail && <div className="invalid-feedback">{validationErrors.hospitalEmail}</div>}
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    className={`form-control ${validationErrors.hospitalAadhar ? 'is-invalid' : ''}`}
                                                    id="hospitalAadhar"
                                                    name="hospitalAadhar"
                                                    value={hospitalData.hospitalAadhar}
                                                    onChange={handleChange}
                                                    placeholder="Aadhar Number *"
                                                    required
                                                />
                                                {validationErrors.hospitalAadhar && <div className="invalid-feedback">{validationErrors.hospitalAadhar}</div>}
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="tel"
                                                    className={`form-control ${validationErrors.hospitalMobile ? 'is-invalid' : ''}`}
                                                    id="hospitalMobile"
                                                    name="hospitalMobile"
                                                    value={hospitalData.hospitalMobile}
                                                    onChange={handleChange}
                                                    placeholder="Mobile Number *"
                                                    required
                                                />
                                                {validationErrors.hospitalMobile && <div className="invalid-feedback">{validationErrors.hospitalMobile}</div>}
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="url"
                                                    className={`form-control ${validationErrors.hospitalWebSite ? 'is-invalid' : ''}`}
                                                    id="hospitalWebSite"
                                                    name="hospitalWebSite"
                                                    value={hospitalData.hospitalWebSite}
                                                    onChange={handleChange}
                                                    placeholder="Website URL"
                                                />
                                                {validationErrors.hospitalWebSite && <div className="invalid-feedback">{validationErrors.hospitalWebSite}</div>}
                                            </div>
                                            <div className="col-md-6">
                                                <input
                                                    type="text"
                                                    className={`form-control ${validationErrors.hospitalAddress ? 'is-invalid' : ''}`}
                                                    id="hospitalAddress"
                                                    name="hospitalAddress"
                                                    value={hospitalData.hospitalAddress}
                                                    onChange={handleChange}
                                                    placeholder="Address *"
                                                    required
                                                />
                                                {validationErrors.hospitalAddress && <div className="invalid-feedback">{validationErrors.hospitalAddress}</div>}
                                            </div>
                                            <div className="col-md-6">
                                                <div className="input-group">
                                                    <input
                                                        type={showPassword ? "text" : "password"}
                                                        className={`form-control ${validationErrors.hospitalPassword ? 'is-invalid' : ''}`}
                                                        id="hospitalPassword"
                                                        name="hospitalPassword"
                                                        value={hospitalData.hospitalPassword}
                                                        onChange={handleChange}
                                                        placeholder="Password *"
                                                        required
                                                    />
                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-secondary"
                                                        onClick={togglePasswordVisibility}
                                                    >
                                                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                                    </button>
                                                </div>
                                                {validationErrors.hospitalPassword && <div className="invalid-feedback" style={{ display: 'block' }}>{validationErrors.hospitalPassword}</div>}
                                            </div>
                                            <div className="col-md-6">
                                                <button
                                                    type="button"
                                                    className={`btn ${validationErrors.hospitalImage ? 'btn-danger' : 'btn-outline-primary'} w-100`}
                                                    onClick={() => document.getElementById('hospitalImage').click()}
                                                    style={{ marginBottom: '5px' }}
                                                >
                                                    {fileName ? fileName : 'Hospital Image'}
                                                </button>
                                                <input
                                                    type="file"
                                                    className={`form-control-file ${validationErrors.hospitalImage ? 'is-invalid' : ''}`}
                                                    id="hospitalImage"
                                                    name="hospitalImage"
                                                    onChange={handleImageUpload}
                                                    accept=".jpg, .jpeg, .png"
                                                    style={{ display: 'none' }}
                                                />
                                                {validationErrors.hospitalImage && <div className="invalid-feedback" style={{ display: 'block' }}>{validationErrors.hospitalImage}</div>}
                                            </div>
                                        </div>
                                        <div className="text-center mt-4">
                                            <button
                                                type="submit"
                                                className={`btn ${submitFailed ? 'btn-danger' : 'btn-success'}`}
                                                disabled={isLoading}
                                            >
                                                {isLoading ? 'Submitting...' : 'Register'}
                                            </button>
                                        </div>
                                        {submitFailed && <div className="text-danger mt-3">Registration failed. Please try again.</div>}
                                    </form>
                                    <div className="form-footer mt-3 text-center">
                                        <button type="button" className="btn btn-secondary" onClick={handleAlreadyHaveAccount}>
                                            Already have an account? Login
                                        </button>
                                    </div>
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

export default HospitalRegistration;
