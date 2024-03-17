import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import HospitalStaffNavbar from './HospitalStaffNavbar';

const HospitalStaffViewAllPatients = () => {
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

        const fetchPatients = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospitalStaff/hospitalStaffViewAllPatients',
                    { hospitalStaffId },
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
        navigate(`/hospitalStaffViewOnePatient`);
    };

    // Function to format date and time
    const formatDate = (dateTime) => {
        const date = new Date(dateTime);
        const formattedDate = date.toLocaleDateString('en-GB'); // Format: DD/MM/YYYY
        const formattedTime = date.toLocaleTimeString('en-US', { hour12: false }); // Format: HH:MM
        return `${formattedDate} ${formattedTime}`;
    };



    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

            <HospitalStaffNavbar />
            <div className="flex-grow-1 container-fluid py-4" style={{ overflowY: 'auto' }}>
                <div className="container">
                    {isLoading ? (
                        <p className="text-center" style={{ color: '#FFFFFF' }}>Loading patients...</p> // Optional: Adjust text color for visibility
                    ) : patientList.length > 0 ? (
                        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 justify-content-center">
                            {patientList.map((patient, index) => (
                                <div key={index} className="col">
                                    <div className="card h-100 shadow-sm rounded-3" style={{
                                        border: '1px solid transparent',
                                        transition: 'transform 0.3s ease, boxShadow 0.3s ease, border 0.3s ease',
                                        borderRadius: '15px',
                                        backgroundColor: '#FFFFFF', // Ensure card background contrasts with the dark gradient
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'scale(1.05)';
                                            e.currentTarget.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.2)';
                                            e.currentTarget.style.borderColor = '#007bff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'scale(1)';
                                            e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
                                            e.currentTarget.style.borderColor = 'transparent';
                                        }}
                                        onClick={() => handleViewPatient(patient.patientId)}
                                    >
                                        <div className="card-img-top rounded-circle overflow-hidden d-flex justify-content-center align-items-center" style={{
                                            background: '#f0f0f0',
                                            padding: '5px', // Adjusts the padding around the image for the frame effect
                                            height: '200px', // Adjust height as necessary
                                            width: '200px', // Adjust width as necessary
                                            margin: '15px auto 0' // Centers the image on the card
                                        }}>
                                            <img src={patient.patientProfileImage} alt="Patient" style={{
                                                height: '100%', // Ensures the image fully covers the frame area
                                                width: '100%', // Ensures the image fully covers the frame area
                                                objectFit: 'cover',
                                                borderRadius: '50%', // Fully rounds the image
                                            }} />
                                        </div>
                                        <div className="card-body">
                                            <h5 className="card-title mb-3">{patient.patientName}</h5>
                                            <ul className="list-unstyled">
                                                <li className="mb-2"><small className="text-muted">Registered Date: {formatDate(patient.registeredDate)}</small></li>
                                                <li className="mb-2"><small className="text-muted">Discharge Status: {patient.dischargeStatus === 1 ? 'Discharged' : 'Not Discharged'}</small></li>
                                                <li><small className="text-muted">Aadhar: {patient.patientAadhar}</small></li>
                                                <li><small className="text-muted">Mobile: {patient.patientMobile}</small></li>
                                                <li><small className="text-muted">Address: {patient.patientAddress}</small></li>
                                                <li><small className="text-muted">Ward: {patient.admittedWard}</small></li>
                                                <li><small className="text-muted">Diagnosis or disease type: {patient.diagnosisOrDiseaseType}</small></li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center mt-4" style={{ color: '#FFFFFF' }}>No patients found.</p> // Optional: Adjust text color for visibility
                    )}
                </div>
            </div>
            <Footer className="mt-auto" />
        </div>
        

    );
};

export default HospitalStaffViewAllPatients;
