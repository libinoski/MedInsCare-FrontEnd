import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

// Function to format date and time
const formatDate = (dateTime) => {
    const date = new Date(dateTime);
    const formattedDate = date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
    const formattedTime = date.toLocaleTimeString('en-US', { hour12: false }); // Format: HH:MM
    return `${formattedDate} ${formattedTime}`;
};

const HospitalViewAllPatients = () => {
    const navigate = useNavigate();
    const [patientList, setPatientList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleErrors = (error) => {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 422:
                        const errorMessage422 = data.error || "An error occurred while fetching patients.";
                        alert(errorMessage422);
                        break;
                    case 500:
                        alert(data.error || 'Internal server error. Please try again later.');
                        break;
                    default:
                        alert('An error occurred. Please try again.');
                        break;
                }
            } else {
                alert('An error occurred. Please check your connection and try again.');
            }
        };

        const fetchPatients = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewAllPatients',
                    { hospitalId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setPatientList(response.data.data);
                }
            } catch (error) {
                handleErrors(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatients();
    }, [navigate]);

    const handleViewPatient = (patientId) => {
        sessionStorage.setItem('patientId', patientId);
        navigate(`/hospitalViewOnePatient`);
    };

    return (
<div className="d-flex flex-column min-vh-100">
    <Navbar />
    <div className="container flex-grow-1 my-5" style={{ overflowY: 'auto' }}>
        {isLoading ? (
            <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading patients...</span>
                </div>
            </div>
        ) : patientList.length > 0 ? (
            <div className="row row-cols-1 row-cols-md-3 g-4 justify-content-center">
                {patientList.map((patient, index) => (
                    <div
                        key={index}
                        className="col"
                        onClick={() => handleViewPatient(patient.patientId)}
                    >
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="flex-shrink-0">
                                        <div className="d-flex align-items-center justify-content-center" style={{ width: '60px', height: '60px', overflow: 'hidden', borderRadius: '50%', border: '3px solid #007bff' }}>
                                            {patient.patientProfileImage ? (
                                                <img
                                                    src={patient.patientProfileImage}
                                                    alt="Patient"
                                                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                                />
                                            ) : (
                                                <i className="fas fa-user-alt fa-lg text-secondary"></i> // Placeholder icon if no image
                                            )}
                                        </div>
                                    </div>
                                    <div className="ms-3">
                                        <h5 className="card-title">{patient.patientName}</h5>
                                    </div>
                                </div>
                                <div className="card-text">
                                    <p className="text-muted mb-2"><strong>Registered Date:</strong> {formatDate(patient.registeredDate)}</p>
                                    <p className="text-muted mb-2"><strong>Ward:</strong> {patient.admittedWard}</p>
                                    <p className="text-muted mb-2"><strong>Diagnosis:</strong> {patient.diagnosisOrDiseaseType}</p>
                                    <p className="text-muted mb-2"><strong>Discharge Status:</strong> {patient.dischargeStatus === 1 ? 'Discharged' : 'Not Discharged'}</p>
                                    <p className="text-muted mb-2"><strong>Aadhar:</strong> {patient.patientAadhar}</p>
                                    <p className="text-muted mb-2"><strong>Mobile:</strong> {patient.patientMobile}</p>
                                    <p className="text-muted"><strong>Address:</strong> {patient.patientAddress}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="alert alert-warning text-center" role="alert">
                No patients found.
            </div>
        )}
    </div>
    <Footer />
</div>

    );
};

export default HospitalViewAllPatients;
