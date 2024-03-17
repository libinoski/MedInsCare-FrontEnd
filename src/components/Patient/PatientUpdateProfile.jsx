import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import PatientNavbar from './PatientNavbar';
import Footer from '../Common/Footer';


const PatientUpdateProfile = () => {
    const navigate = useNavigate();
    const [patientProfile, setPatientProfile] = useState({
        patientName: '',
        patientMobile: '',
        patientAddress: '',
        patientAadhar: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});
    const [showConfirmation, setShowConfirmation] = useState(false);

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const patientId = sessionStorage.getItem('patientId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/patient/patientViewProfile',
                    { patientId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    const { patientName, patientMobile, patientAddress, patientAadhar } = response.data.data;
                    setPatientProfile({
                        patientName,
                        patientMobile,
                        patientAddress,
                        patientAadhar,
                    });
                }
            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response;
                    switch (status) {
                        case 401:
                        case 403:
                            alert(data.message || 'Unauthorized access. Please login again.');
                            navigate('/patientLogin');
                            break;
                        case 422:
                            const errorMessage422 = data.error || "An error occurred during profile view.";
                            alert(errorMessage422);
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

        fetchProfile();
    }, [navigate]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setPatientProfile({ ...patientProfile, [name]: value });
        if (errorMessages[name]) {
            setErrorMessages({ ...errorMessages, [name]: '' });
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setErrorMessages({});
        try {
            const token = sessionStorage.getItem('token');
            const patientId = sessionStorage.getItem('patientId');
            const response = await axios.post('http://localhost:1313/api/mic/patient/patientUpdateProfile', { ...patientProfile, patientId }, {
                headers: {
                    'token': token,
                },
            });
            if (response.status === 200) {
                alert(response.data.message);
                navigate('/patientViewProfile');
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        setErrorMessages(data.results || {});
                        break;
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/patientLogin');
                        break;
                    case 422:
                        const errorMessage = data.error || "An error occurred during profile update.";
                        alert(errorMessage);
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

    const handleConfirmation = () => {
        const hasErrors = Object.keys(errorMessages).length > 0;
        if (!hasErrors) {
            setShowConfirmation(true);
        } else {
            handleSubmit();
        }
    };

    const handleConfirmSubmit = () => {
        setShowConfirmation(false);
        handleSubmit();
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <PatientNavbar />
            <div className="container-fluid" style={{ paddingTop: '56px', paddingBottom: '80px' }}>
                <div className="row">
                    <div className="col-12 d-flex align-items-center justify-content-center">
                        <div className="card" style={{ width: '100%', maxWidth: '500px', backgroundColor: 'rgba(255, 255, 255, 1)', border: Object.keys(errorMessages).length > 0 ? '1px solid red' : 'none' }}>
                            <div className="card-body">
                                <form onSubmit={handleSubmit} noValidate>
                                    <div className="mb-3">
                                        <label htmlFor="patientName" className="form-label">Patient Name:</label>
                                        <input
                                            type="text"
                                            name="patientName"
                                            value={patientProfile.patientName}
                                            onChange={handleInputChange}
                                            className={`form-control ${errorMessages.patientName ? 'is-invalid' : ''}`}
                                            id="patientName"
                                            required
                                        />
                                        {errorMessages.patientName && <div className="invalid-feedback">{errorMessages.patientName}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="patientMobile" className="form-label">Mobile:</label>
                                        <input
                                            type="text"
                                            name="patientMobile"
                                            value={patientProfile.patientMobile}
                                            onChange={handleInputChange}
                                            className={`form-control ${errorMessages.patientMobile ? 'is-invalid' : ''}`}
                                            id="patientMobile"
                                            required
                                        />
                                        {errorMessages.patientMobile && <div className="invalid-feedback">{errorMessages.patientMobile}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="patientAadhar" className="form-label">Aadhar:</label>
                                        <input
                                            type="text"
                                            name="patientAadhar"
                                            value={patientProfile.patientAadhar}
                                            onChange={handleInputChange}
                                            className={`form-control ${errorMessages.patientAadhar ? 'is-invalid' : ''}`}
                                            id="patientAadhar"
                                            required
                                        />
                                        {errorMessages.patientAadhar && <div className="invalid-feedback">{errorMessages.patientAadhar}</div>}
                                    </div>

                                    <div className="mb-3">
                                        <label htmlFor="patientAddress" className="form-label">Address:</label>
                                        <input
                                            type="text"
                                            name="patientAddress"
                                            value={patientProfile.patientAddress}
                                            onChange={handleInputChange}
                                            className={`form-control ${errorMessages.patientAddress ? 'is-invalid' : ''}`}
                                            id="patientAddress"
                                            required
                                        />
                                        {errorMessages.patientAddress && <div className="invalid-feedback">{errorMessages.patientAddress}</div>}
                                    </div>

                                    <div className="d-flex justify-content-center gap-3 mt-4">
                                        {showConfirmation ? (
                                            <div className="d-flex justify-content-center">
                                                <p>Are you sure you want to update the patient profile?</p>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary text-dark d-flex justify-content-center align-items-center mr-2"
                                                    onClick={() => setShowConfirmation(false)}
                                                    style={{
                                                        border: '2px solid #6c757d',
                                                        color: '#6c757d',
                                                        fontWeight: 'bold',
                                                        boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
                                                        padding: '10px 20px',
                                                        borderRadius: '25px',
                                                        textDecoration: 'none',
                                                        marginRight: '8px' // Adjusting spacing between buttons
                                                    }}
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary text-dark d-flex justify-content-center align-items-center"
                                                    onClick={handleConfirmSubmit}
                                                    style={{
                                                        border: '2px solid #6c757d',
                                                        color: '#6c757d',
                                                        fontWeight: 'bold',
                                                        boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
                                                        padding: '10px 20px',
                                                        borderRadius: '25px',
                                                        textDecoration: 'none'
                                                    }}
                                                >
                                                    Confirm
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary text-dark d-flex justify-content-center align-items-center"
                                                disabled={isLoading}
                                                onClick={handleConfirmation}
                                                style={{
                                                    border: '2px solid #6c757d',
                                                    color: '#6c757d',
                                                    fontWeight: 'bold',
                                                    boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
                                                    padding: '10px 20px',
                                                    borderRadius: '25px',
                                                    width: '100%',
                                                    maxWidth: '200px', // Adjust based on your preference
                                                    textDecoration: 'none'
                                                }}
                                            >
                                                {isLoading ? 'Updating Profile...' : 'Update'}
                                            </button>
                                        )}
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

export default PatientUpdateProfile;
