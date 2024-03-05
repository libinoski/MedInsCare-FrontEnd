import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './PatientNavbar';
import Footer from '../Common/Footer';

const PatientViewOneInsurancePackage = () => {
    const navigate = useNavigate();
    const [packageDetails, setPackageDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const handleError = useCallback((error) => {
        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 401:
                case 403:
                    alert(data.message || 'Unauthorized access. Please login again.');
                    navigate('/patientLogin');
                    break;
                case 422:
                    setError(data.error || "An error occurred while fetching package details.");
                    break;
                case 500:
                    setError(data.message || 'Internal server error. Please try again later.');
                    break;
                default:
                    setError('An error occurred. Please try again.');
                    break;
            }
        } else {
            setError('An error occurred. Please check your connection and try again.');
        }
    }, [navigate]);

    const fetchPackageDetails = useCallback(async () => {
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const patientId = sessionStorage.getItem('patientId');
            const packageId = sessionStorage.getItem('packageId');
            const response = await axios.post(
                `http://localhost:1313/api/mic/patient/patientViewOneInsurancePackage`,
                { patientId, packageId },
                {
                    headers: {
                        token
                    }
                }
            );
            if (response.status === 200) {
                setPackageDetails(response.data.data);
            }
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoading(false);
        }
    }, [handleError]);

    useEffect(() => {
        fetchPackageDetails();
    }, [fetchPackageDetails]);

    const handleChoosePackage = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const patientId = sessionStorage.getItem('patientId');
            const packageId = sessionStorage.getItem('packageId');
            const response = await axios.post(
                `http://localhost:1313/api/mic/patient/patientChooseInsurancePackage`,
                { patientId, packageId },
                {
                    headers: {
                        token
                    }
                }
            );
            if (response.status === 200) {
                alert(response.data.message);
                navigate('/patientViewAllInsurancePackages'); 
            }
        } catch (error) {
            handleError(error);
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div className="container-fluid py-5" style={{ backgroundColor: '#f0f4f7', flex: '1' }}>
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8">
                        {isLoading ? (
                            <div className="text-center">
                                <div className="spinner-border text-primary" role="status">
                                    <span className="visually-hidden">Loading Package Details...</span>
                                </div>
                            </div>
                        ) : error ? (
                            <p className="text-center text-danger">{error}</p>
                        ) : packageDetails ? (
                            <div className="card shadow" style={{ borderRadius: '20px', overflow: 'hidden' }}>
                                <div className="card-body p-4 p-md-5">
                                    <div className="row align-items-center">
                                        <div className="col-md-6 text-center mb-4 mb-md-0">
                                            <img
                                                src={packageDetails.packageImage}
                                                alt="Package"
                                                className="img-fluid rounded-circle border"
                                                style={{ width: '200px', height: '200px', objectFit: 'cover', border: '5px solid #ffffff', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                                            />
                                        </div>
                                        <div className="col-md-6">
                                            <h2 className="card-title" style={{ color: '#0056b3' }}>{packageDetails.packageTitle}</h2>
                                            <p className="mb-2"><strong>Description:</strong> {packageDetails.packageDescription}</p>
                                            <p className="mb-2"><strong>Terms and Conditions:</strong> {packageDetails.packageTAndC}</p>
                                            <p className="mb-2"><strong>Amount:</strong> {packageDetails.packageAmount}</p>
                                            <p className="mb-2"><strong>Duration:</strong> {packageDetails.packageDuration}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="card-footer text-muted" style={{ backgroundColor: '#eaeff3', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
                                    <button className="btn btn-primary" onClick={handleChoosePackage}>Choose Package</button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-center">No package details found.</p>
                        )}
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PatientViewOneInsurancePackage;
