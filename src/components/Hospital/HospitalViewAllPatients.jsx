import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

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
    <div className="flex-grow-1 container-fluid p-0" style={{ paddingTop: '60px', overflowY: 'auto' }}>
        {isLoading ? (
            <p className="text-center">Loading patients...</p>
        ) : patientList.length > 0 ? (
            <div className="d-flex flex-column align-items-center justify-content-center pt-5 pb-5" style={{ maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
                {patientList.map((patient, index) => (
                    <div key={index} className="d-flex align-items-center justify-content-start bg-white shadow rounded-3 mb-3 p-3 w-75 border border-success" style={{ cursor: 'pointer' }} onClick={() => handleViewPatient(patient.patientId)}>
                        <div className="me-3" style={{ width: '60px', height: '60px', overflow: 'hidden', borderRadius: '50%', border: '3px solid #007bff' }}>
                            {patient.patientProfileImage && (
                                <img src={patient.patientProfileImage} className="img-fluid rounded-circle" alt="Patient" style={{ objectFit: 'cover', width: '100%', height: '100%' }} />
                            )}
                        </div>
                        <div className="flex-grow-1">
                            <p className="mb-1 fw-bold text-dark" style={{ fontSize: '1rem' }}>{patient.patientName}</p>
                            <p className="mb-1 text-muted" style={{ fontSize: '0.9rem' }}>Registered Date: {new Date(patient.patientRegisteredDate).toLocaleDateString()}</p>
                            <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>Discharge Status: {patient.dischargeStatus === 1 ? 'Discharged' : 'Not Discharged'}</p>
                            <p className="mb-0 text-muted" style={{ fontSize: '0.8rem' }}>Aadhar: {patient.patientAadhar}, Mobile: {patient.patientMobile}, Address: {patient.patientAddress}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <p className="text-center mt-4">No patients found.</p>
        )}
    </div>
    <Footer />
</div>


    
    );
};

export default HospitalViewAllPatients;
