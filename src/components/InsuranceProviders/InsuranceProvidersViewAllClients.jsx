import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import InsuranceProviderNavbar from './InsuranceProviderNavbar';

const InsuranceProviderViewAllClients = () => {
    const navigate = useNavigate();
    const [clientList, setClientList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        const handleErrors = (error) => {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/insuranceProviderLogin');
                        break;
                    case 422:
                        const errorMessage422 = data.error || "An error occurred while fetching clients.";
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

        const fetchClients = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const insuranceProviderId = sessionStorage.getItem('insuranceProviderId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/insuranceProvider/insuranceProviderViewAllClients',
                    { insuranceProviderId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    setClientList(response.data.data);
                }
            } catch (error) {
                handleErrors(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchClients();
    }, [navigate]);

    return (
        <div className="d-flex flex-column min-vh-100">
            <InsuranceProviderNavbar />
            <div className="flex-grow-1 container-fluid py-4" style={{ overflowY: 'auto' }}>
                <div className="container">
                    {isLoading ? (
                        <p className="text-center">Loading clients...</p>
                    ) : clientList.length > 0 ? (
                        <div>
                            {clientList.map((client, index) => (
                                <div key={index}>
                                    <h2>Client ID: {client.clientId}</h2>
                                    <h3>Patient ID: {client.patientId}</h3>
                                    <h4>Package ID: {client.packageId}</h4>
                                    <h4>Insurance Provider ID: {client.insuranceProviderId}</h4>
                                    <h4>Hospital ID: {client.hospitalId}</h4>
                                    <h4>Patient Details:</h4>
                                    <ul>
                                        <li>Name: {client.patientDetails.name}</li>
                                        <li>Email: {client.patientDetails.email}</li>
                                        <li>Aadhar: {client.patientDetails.aadhar}</li>
                                        <li>Mobile: {client.patientDetails.mobile}</li>
                                        <li>Profile Image: <img src={client.patientDetails.profileImage} alt="Profile" /></li>
                                    </ul>
                                    <h4>Package Details:</h4>
                                    <ul>
                                        <li>Title: {client.packageDetails.title}</li>
                                        <li>Details: {client.packageDetails.details}</li>
                                        <li>Amount: {client.packageDetails.amount}</li>
                                        <li>Duration: {client.packageDetails.duration}</li>
                                    </ul>
                                    <h4>Hospital Details:</h4>
                                    <ul>
                                        <li>Name: {client.hospitalDetails.name}</li>
                                        <li>Email: {client.hospitalDetails.email}</li>
                                    </ul>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-center mt-4">No clients found.</p>
                    )}
                </div>
            </div>
            <Footer className="mt-auto" />
        </div>
    );
};

export default InsuranceProviderViewAllClients;
