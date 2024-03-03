import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import backgroundImage from '../../images/Hospital/hr.jpg'; // Import the background image
import Footer from '../Common/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';

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
        <div>
    <Navbar />
    <div className="container-fluid" style={{ paddingTop: '56px', paddingBottom: '80px' }}>
        <div className="row">
            <div className="col-lg-12">
                <div className="row justify-content-center align-items-center" style={{ minHeight: 'calc(50vh - 40px)' }}>
                    <div className="col-lg-12">
                        {isLoading ? (
                            <p className="text-center">Loading patient details...</p>
                        ) : patientDetails ? (
                            <div className="card shadow-lg w-100 h-100 border-0" style={{ borderRadius: '15px', backgroundColor: '#f8f9fa' }}>
                                <div className="card-body">
                                    <div className="row align-items-center">
                                        <div className="col-lg-4 text-center">
                                            <img
                                                src={patientDetails.patientProfileImage}
                                                alt="Profile"
                                                className="img-fluid rounded-circle"
                                                style={{
                                                    width: '200px', /* Increased size */
                                                    height: '200px', /* Increased size */
                                                    objectFit: 'cover'
                                                }}
                                            />
                                            {patientDetails.isVerified && ( // Check if patient is verified
                                                <FontAwesomeIcon icon={faCheckCircle} style={{ color: 'green', position: 'absolute', bottom: 0, right: 0 }} />
                                            )}
                                        </div>
                                        <div className="col-lg-8">
                                            <h5 className="card-title">{patientDetails.patientName}</h5>
                                            <p><strong>Email:</strong> {patientDetails.patientEmail}</p>
                                            <p><strong>Aadhar:</strong> {patientDetails.patientAadhar}</p>
                                            <p><strong>Mobile:</strong> {patientDetails.patientMobile}</p>
                                            <p><strong>Address:</strong> {patientDetails.patientAddress}</p>
                                            <p><strong>Admitted Date:</strong> {patientDetails.patientRegisteredDate}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer border-0 bg-transparent">
                                    <div className="d-flex justify-content-center">
                                        <button
                                            className="btn btn-danger mx-2"
                                            onClick={handleDeletePatient}>
                                            Delete Patient
                                        </button>
                                        <button
                                            className="btn btn-warning mx-2"
                                            onClick={handleSendNotificationToPatient}>
                                            Send Notification
                                        </button>
                                        <button
                                            className="btn btn-info mx-2"
                                            onClick={() => navigate('/hospitalUpdatePatient')}>
                                            Update Patient
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center">No patient details found.</p>
                        )}
                    </div>
                </div>
                <div className="row justify-content-center align-items-end" style={{ minHeight: 'calc(50vh - 40px)' }}>
                    <div className="col-lg-12 d-flex align-items-center justify-content-center">
                        {backgroundImage && (
                            <img src={backgroundImage} className="img-fluid" alt="Background" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                        )}
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</div>




















    );
};

export default HospitalViewOnePatient;
