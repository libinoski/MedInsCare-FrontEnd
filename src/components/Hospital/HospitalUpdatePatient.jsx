import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import HospitalNavbar from './HospitalNavbar';

const HospitalUpdatePatient = () => {
    const navigate = useNavigate();
    const [patient, setPatient] = useState({
        patientId: '',
        hospitalId: '',
        patientName: '',
        patientMobile: '',
        patientAddress: '',
        patientAadhar: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false); // New state for confirmation

    useEffect(() => {
        // Fetch patient details based on patientId or from session storage
        const fetchPatientDetails = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const patientId = sessionStorage.getItem('patientId');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewOnePatient',
                    { hospitalId, patientId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setPatient(response.data.data);
                }
            } catch (error) {
                handleRequestError(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatientDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setPatient({
            ...patient,
            [name]: value
        });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        setShowConfirmation(false); // Close the confirmation dialog
        try {
            const token = sessionStorage.getItem('token');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/hospitalUpdatePatient/',
                patient,
                {
                    headers: {
                        token
                    }
                }
            );
            if (response.status === 200) {
                alert('Patient updated successfully.');
                // Redirect to a suitable page after updating staff details
                navigate('/hospitalViewAllPatients');
            }
        } catch (error) {
            handleRequestError(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleConfirmation = () => {
        // Check if there are any validation errors
        const hasErrors = Object.keys(errors).length > 0;
        if (!hasErrors) {
            // If no errors, then show confirmation and submit
            setShowConfirmation(true);
        } else {
            // If there are errors, submit without showing confirmation
            handleSubmit();
        }
    };

    const handleRequestError = (error) => {
        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 400:
                    setErrors(data.results || {});
                    break;
                case 401:
                case 403:
                    alert(data.message || 'Unauthorized access. Please login again.');
                    navigate('/hospitalLogin');
                    break;
                case 404:
                    alert(data.message || 'Resource not found.');
                    break;
                case 422:
                    alert(data.error || 'Patient not found.');
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
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

{/* Navbar */}
    <HospitalNavbar />
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ flex: '1', paddingTop: '56px', paddingBottom: '80px' }}>
        <div style={{ maxWidth: '400px', width: '100%', padding: '20px', border: Object.keys(errors).length > 0 ? '1px solid red' : 'none' }}>
            <form onSubmit={handleSubmit} noValidate>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input type="text" className={`form-control ${errors.patientName ? 'is-invalid' : ''}`} name="patientName" value={patient.patientName} onChange={handleChange} />
                    {errors.patientName && <div className="invalid-feedback">{errors.patientName}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Mobile</label>
                    <input type="text" className={`form-control ${errors.patientMobile ? 'is-invalid' : ''}`} name="patientMobile" value={patient.patientMobile} onChange={handleChange} />
                    {errors.patientMobile && <div className="invalid-feedback">{errors.patientMobile}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Address</label>
                    <input type="text" className={`form-control ${errors.patientAddress ? 'is-invalid' : ''}`} name="patientAddress" value={patient.patientAddress} onChange={handleChange} />
                    {errors.patientAddress && <div className="invalid-feedback">{errors.patientAddress}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Aadhar</label>
                    <input type="text" className={`form-control ${errors.patientAadhar ? 'is-invalid' : ''}`} name="patientAadhar" value={patient.patientAadhar} onChange={handleChange} />
                    {errors.patientAadhar && <div className="invalid-feedback">{errors.patientAadhar}</div>}
                </div>
                <div className="d-flex justify-content-center align-items-center" >
                    <button
                        type="button"
                        className="btn btn-outline-secondary text-dark d-flex justify-content-center align-items-center"
                        onClick={handleConfirmation}
                        disabled={isLoading}
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
                        {isLoading ? 'Updating...' : 'Update'}
                    </button>
                </div>
            </form>
            {showConfirmation && (
                <div className="d-flex flex-column align-items-center" style={{ marginTop: '16px' }}>
                    <p>Are you sure you want to update the patient details?</p>
                    <div className="d-flex">
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
                                marginRight: '8px', // Adjust the spacing between buttons as needed
                                textDecoration: 'none'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            className="btn btn-outline-secondary text-dark d-flex justify-content-center align-items-center"
                            onClick={handleSubmit}
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
                </div>
            )}
        </div>
    </div>
    <Footer />
</div>


    );
};

export default HospitalUpdatePatient;
