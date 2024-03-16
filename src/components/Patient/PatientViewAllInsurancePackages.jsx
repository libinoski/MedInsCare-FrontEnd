import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import PatientNavbar from './PatientNavbar';

const PatientViewAllInsurancePackages = () => {
    const navigate = useNavigate();
    const [packageList, setPackageList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleErrors = (error) => {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/patientLogin');
                        break;
                    case 422:
                        alert(data.message || "An error occurred while fetching packages.");
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

        const fetchPackages = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const patientId = sessionStorage.getItem('patientId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/patient/patientViewAllInsurancePackages',
                    { patientId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setPackageList(response.data.data || []);
                }
            } catch (error) {
                handleErrors(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPackages();
    }, [navigate]);

    const handleViewPackage = (packageId) => {
        sessionStorage.setItem('packageId', packageId);
        navigate(`/patientViewOneInsurancePackage`);
    };

    return (
<div className="d-flex flex-column min-vh-100">
    <PatientNavbar />
    <div className="flex-grow-1 container" style={{ paddingTop: '70px', paddingBottom: '70px', overflowY: 'auto' }}>
        {isLoading ? (
            <p className="text-center alert alert-info">Loading insurance packages...</p>
        ) : packageList && packageList.length > 0 ? (
            <div className="d-flex flex-wrap justify-content-center pt-5 pb-5">
                {packageList.map((insurancePackage, index) => (
                    <div
                        key={index}
                        className="card shadow-sm rounded-3 mb-3 mx-2"
                        style={{
                            width: '18rem',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease, boxShadow 0.3s ease',
                            borderRadius: '15px',
                            border: '1px solid transparent'
                        }}
                        onClick={() => handleViewPackage(insurancePackage.packageId)}
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
                    >
                        <img src={insurancePackage.packageImage} className="card-img-top" alt="Package" style={{
                            borderTopLeftRadius: '15px',
                            borderTopRightRadius: '15px',
                            objectFit: 'cover', // Ensure the image covers the top part of the card
                            height: '200px' // Standardize the height for uniformity
                        }} />
                        <div className="card-body">
                            <h5 className="card-title">{insurancePackage.packageTitle}</h5>
                            <p className="card-text">{insurancePackage.packageDetails}</p>
                            <p className="card-text"><strong>Amount:</strong> ${insurancePackage.packageAmount}</p>
                            <p className="card-text"><strong>Duration:</strong> {insurancePackage.packageDuration}</p>
                        </div>
                    </div>
                ))}
            </div>
        ) : (
            <div className="text-center alert alert-warning mt-4">No insurance packages found.</div>
        )}
    </div>
    <Footer />
</div>

    );
};

export default PatientViewAllInsurancePackages;
