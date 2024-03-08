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
            <div className="flex-grow-1 container" style={{ paddingTop: '70px', paddingBottom: '70px', overflowY: 'auto' }}>
                {isLoading ? (
                    <p className="text-center alert alert-info">Loading patients...</p>
                ) : patientList.length > 0 ? (
                    <div className="d-flex flex-wrap justify-content-center pt-5 pb-5">
                        {patientList.map((patient, index) => (
                            <div
                                key={index}
                                className="card shadow-sm rounded-3 mb-3 mx-2" style={{ width: '18rem', cursor: 'pointer' }}
                                onClick={() => handleViewPatient(patient.patientId)}
                            >
                                <div className="card-body">
                                    <div className="d-flex align-items-center mb-3">
                                        <div style={{ width: '60px', height: '60px', overflow: 'hidden', borderRadius: '50%', border: '3px solid #007bff' }}>
                                            {patient.patientProfileImage && (
                                                <img
                                                    src={patient.patientProfileImage}
                                                    className="card-img-top img-fluid rounded-circle"
                                                    alt="Patient"
                                                    style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                                                />
                                            )}
                                        </div>
                                        <div className="flex-grow-1 ms-3">
                                            <h5 className="card-title">{patient.patientName}</h5>
                                        </div>
                                    </div>
                                    <p className="card-text text-muted">
                                        <span style={{ fontWeight: 'bold' }}>Registered Date:</span> {formatDate(patient.registeredDate)}
                                    </p>
                                    <p className="card-text text-muted">
                                        <span style={{ fontWeight: 'bold' }}>Ward:</span> {patient.admittedWard}
                                    </p>
                                    <p className="card-text text-muted">
                                        <span style={{ fontWeight: 'bold' }}>Diagnosis or disease type:</span> {patient.diagnosisOrDiseaseType}
                                    </p>
                                    <p className="card-text text-muted">
                                        <span style={{ fontWeight: 'bold' }}>Discharge Status:</span> {patient.dischargeStatus === 1 ? 'Discharged' : 'Not Discharged'}
                                    </p>
                                    <p className="card-text text-muted">
                                        <span style={{ fontWeight: 'bold' }}>Aadhar:</span> {patient.patientAadhar}
                                    </p>
                                    <p className="card-text text-muted">
                                        <span style={{ fontWeight: 'bold' }}>Mobile:</span> {patient.patientMobile}
                                    </p>
                                    <p className="card-text text-muted">
                                        <span style={{ fontWeight: 'bold' }}>Address:</span> {patient.patientAddress}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center alert alert-warning mt-4">No patients found.</div>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default HospitalViewAllPatients;
