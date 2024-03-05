import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';


const HospitalViewOnePatient = () => {
    const navigate = useNavigate();
    const [patientDetails, setPatientDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const fetchPatientDetails = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const patientId = sessionStorage.getItem('patientId');
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
                    setPatientDetails(response.data.data);
                }
            } catch (error) {
                if (error.response) {
                    const { status, data } = error.response;
                    switch (status) {
                        case 401:
                        case 403:
                            alert(data.message || 'Unauthorized access. Please login again.');
                            navigate('/hospitalLogin');
                            break;
                        case 422:
                            const errorMessage422 = data.error || "An error occurred while fetching staff details.";
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
            } finally {
                setIsLoading(false);
            }
        };

        fetchPatientDetails();
    }, [navigate]);

    const handleDeletePatient = async () => {
        const confirmed = window.confirm("Are you sure you want to delete this patient?");
        if (!confirmed) return;

        try {
            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const patientId = sessionStorage.getItem('patientId');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/deleteOnePatient',
                { hospitalId, patientId },
                {
                    headers: {
                        token
                    }
                }
            );
            if (response.status === 200) {
                alert('Patient deleted successfully.');
                navigate('/hospitalViewAllPatients'); // Redirect to the home page or any other appropriate page
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 422:
                        const errorMessage422 = data.error || "An error occurred while deleting the patient.";
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
        }
    };

    const handleSendNotificationToPatient = () => {
        navigate('/hospitalSendNotificationToPatient');
    };

    return (
<div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
    <Navbar />
    <div className="container-fluid py-5" style={{ backgroundColor: '#f0f4f7', flex: '1 0 auto' }}>
        <div className="row justify-content-center">
            <div className="col-12 col-md-10 col-lg-8">
                {isLoading ? (
                    <div className="text-center">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading patient details...</span>
                        </div>
                    </div>
                ) : patientDetails ? (
                    <div className="card shadow" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                        <div className="card-body p-4 p-md-5">
                            <div className="row align-items-center">
                                <div className="col-lg-4 text-center mb-4 mb-lg-0">
                                    <img
                                        src={patientDetails.patientProfileImage}
                                        alt="Profile"
                                        className="img-fluid rounded-circle border"
                                        style={{ width: '200px', height: '200px', objectFit: 'cover', border: '5px solid #ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                                    />
                                    {patientDetails.isVerified && (
                                        // Assuming FontAwesomeIcon component integration
                                        <i className="fas fa-check-circle" style={{ color: 'green', position: 'absolute', bottom: '10px', right: '10px', fontSize: '24px' }}></i>
                                    )}
                                </div>
                                <div className="col-lg-8">
                                    <h2 className="card-title" style={{ color: '#0056b3' }}>{patientDetails.patientName}</h2>
                                    <p className="mb-2"><strong>Email:</strong> {patientDetails.patientEmail}</p>
                                    <p className="mb-2"><strong>Aadhar:</strong> {patientDetails.patientAadhar}</p>
                                    <p className="mb-2"><strong>Mobile:</strong> {patientDetails.patientMobile}</p>
                                    <p className="mb-2"><strong>Address:</strong> {patientDetails.patientAddress}</p>
                                    <p><strong>Admitted Date:</strong> {patientDetails.patientRegisteredDate}</p>
                                </div>
                            </div>
                        </div>
                        <div className="card-footer d-flex justify-content-center bg-transparent">
                            <button className="btn mx-2" onClick={handleDeletePatient} style={{ backgroundImage: 'linear-gradient(135deg, #ff416c, #ff4b2b)', color: 'white' }}>Delete Patient</button>
                            <button className="btn mx-2" onClick={handleSendNotificationToPatient} style={{ backgroundImage: 'linear-gradient(135deg, #FFD200, #F7971E)', color: 'white' }}>Send Notification</button>
                            <button className="btn mx-2" onClick={() => navigate('/hospitalUpdatePatient')} style={{ backgroundImage: 'linear-gradient(135deg, #00B4DB, #0083B0)', color: 'white' }}>Update Patient</button>
                        </div>
                    </div>
                ) : (
                    <p className="text-center">No patient details found.</p>
                )}
            </div>
        </div>
    </div>
    <Footer className="mt-auto" />
</div>






















    );
};

export default HospitalViewOnePatient;
