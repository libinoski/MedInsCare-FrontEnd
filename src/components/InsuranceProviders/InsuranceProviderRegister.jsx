import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/Hospital/insp.jpg'; // Import the background image
import InsuranceProviderNavbar from './InsuranceProviderNavbar';
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
    <InsuranceProviderNavbar />
    <div className="container-fluid position-relative" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh' }}>
        <div className="row justify-content-center align-items-center">
            <div className="col-lg-8 mt-5">
                <div className="card shadow mb-5 mb-lg-0 position-relative" style={{ borderRadius: '20px', boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.1)', backdropFilter: 'blur(10px)', backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                    <div className="card-body" style={{ zIndex: '1', position: 'relative' }}>
                        <h1 className="text-center mb-4">Insurance Provider Registration</h1>
                        <div className="text-center mb-3">


                            {submitFailed && <div className="text-danger">Registration failed. Please try again.</div>}
                        </div>
                        <form ref={formRef} onSubmit={handleSubmit} noValidate>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <input type="text" className={`form-control ${validationErrors.insuranceProviderName ? 'is-invalid' : ''}`} id="insuranceProviderName" name="insuranceProviderName" placeholder="Name *" value={insuranceProviderData.insuranceProviderName} onChange={handleInputChange} required />
                                    {validationErrors.insuranceProviderName && <div className="invalid-feedback">{validationErrors.insuranceProviderName}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <input type="email" className={`form-control ${validationErrors.insuranceProviderEmail ? 'is-invalid' : ''}`} id="insuranceProviderEmail" name="insuranceProviderEmail" placeholder="Email *" value={insuranceProviderData.insuranceProviderEmail} onChange={handleInputChange} required />
                                    {validationErrors.insuranceProviderEmail && <div className="invalid-feedback">{validationErrors.insuranceProviderEmail}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <input type="text" className={`form-control ${validationErrors.insuranceProviderAadhar ? 'is-invalid' : ''}`} id="insuranceProviderAadhar" name="insuranceProviderAadhar" placeholder="Aadhar Number *" value={insuranceProviderData.insuranceProviderAadhar} onChange={handleInputChange} required />
                                    {validationErrors.insuranceProviderAadhar && <div className="invalid-feedback">{validationErrors.insuranceProviderAadhar}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <input type="tel" className={`form-control ${validationErrors.insuranceProviderMobile ? 'is-invalid' : ''}`} id="insuranceProviderMobile" name="insuranceProviderMobile" placeholder="Mobile Number *" value={insuranceProviderData.insuranceProviderMobile} onChange={handleInputChange} required />
                                    {validationErrors.insuranceProviderMobile && <div className="invalid-feedback">{validationErrors.insuranceProviderMobile}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <input type="file" id="insuranceProviderProfileImage" name="insuranceProviderProfileImage" onChange={handleProfileImageUpload} style={{ display: 'none' }} accept=".jpg, .jpeg, .png" required />
                                    <label htmlFor="insuranceProviderProfileImage" className={`btn ${validationErrors.insuranceProviderProfileImage ? 'btn-danger' : 'btn-primary'}`}>
                                        Upload Profile Image
                                    </label>
                                    {profileImageFileName && <div>Selected profile image file: {profileImageFileName}</div>}
                                    {validationErrors.insuranceProviderProfileImage && <div className="text-danger">{validationErrors.insuranceProviderProfileImage}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <input type="file" id="insuranceProviderIdProofImage" name="insuranceProviderIdProofImage" onChange={handleIdProofImageUpload} style={{ display: 'none' }} accept=".jpg, .jpeg, .png" required />
                                    <label htmlFor="insuranceProviderIdProofImage" className={`btn ${validationErrors.insuranceProviderIdProofImage ? 'btn-danger' : 'btn-primary'}`}>
                                        Upload ID Proof Image
                                    </label>
                                    {idProofImageFileName && <div>Selected ID proof image file: {idProofImageFileName}</div>}
                                    {validationErrors.insuranceProviderIdProofImage && <div className="text-danger">{validationErrors.insuranceProviderIdProofImage}</div>}
                                </div>
                                <div className="col-md-12 mb-3">
                                    <textarea className={`form-control ${validationErrors.insuranceProviderAddress ? 'is-invalid' : ''}`} id="insuranceProviderAddress" name="insuranceProviderAddress" placeholder="Address *" value={insuranceProviderData.insuranceProviderAddress} onChange={handleInputChange} required />
                                    {validationErrors.insuranceProviderAddress && <div className="invalid-feedback">{validationErrors.insuranceProviderAddress}</div>}
                                </div>
                                <div className="col-md-6 mb-3">
                                    <div className="input-group">
                                        <input type={showPassword ? "text" : "password"} className={`form-control ${validationErrors.insuranceProviderPassword ? 'is-invalid' : ''}`} id="insuranceProviderPassword" name="insuranceProviderPassword" placeholder="Password *" value={insuranceProviderData.insuranceProviderPassword} onChange={handleInputChange} required />
                                        <button type="button" className="btn btn-outline-secondary" onClick={togglePasswordVisibility}>
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                    {validationErrors.insuranceProviderPassword && <div className="invalid-feedback" style={{ display: 'block' }}>{validationErrors.insuranceProviderPassword}</div>}
                                </div>
                                <div className="col-md-6 mb-3 position-relative">
                                    <div className="dropdown">
                                        <button className="btn btn-outline-secondary dropdown-toggle" type="button" id="hospitalDropdown" data-bs-toggle="dropdown" aria-expanded="false">
                                            {selectedHospital ? hospitals.find(h => h.hospitalId === selectedHospital)?.hospitalName : "Select Hospital"}
                                        </button>
                                        <ul className="dropdown-menu" aria-labelledby="hospitalDropdown">
                                            {hospitals.map(hospital => (
                                                <li key={hospital.hospitalId}>
                                                    <button className="dropdown-item d-flex align-items-center" type="button" onClick={() => handleHospitalChange(hospital.hospitalId)}>
                                                        <img src={hospital.hospitalImage} alt="Hospital Profile" className="rounded-circle me-2" style={{ width: '30px', height: '30px' }} />
                                                        <span>{hospital.hospitalName}</span>
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    {validationErrors.selectedHospital && <div className="invalid-feedback">{validationErrors.selectedHospital}</div>}
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-6">
                                    <div className="form-footer mt-3">
                                        <button type="button" className="btn btn-secondary" onClick={handleAlreadyHaveAccount}>
                                            Already have an account? Login
                                        </button>
                                    </div>
                                </div>
                                <div className="col-md-6 text-md-end">
                                    <div className="form-footer mt-3">
                                        <button type="submit" className={`btn ${submitFailed ? 'btn-danger' : 'btn-success'}`} disabled={isLoading}>
                                            {isLoading ? 'Submitting...' : 'Register'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer style={{ marginTop: '20px' }} />
</div>







    












    );
};

export default InsuranceProviderRegistration;
