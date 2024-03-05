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
                clientList.map((client, index) => (
                    <div key={index} className="card mb-3">
                        <div className="card-body">
                            <h5 className="card-title">Client ID: {client.clientId}</h5>
                            <div className="row">
                                <div className="col-lg-6 col-md-6 col-sm-12">
                                    <p><strong>Patient ID:</strong> {client.patientId}</p>
                                    <p><strong>Package ID:</strong> {client.packageId}</p>
                                    <p><strong>Insurance Provider ID:</strong> {client.insuranceProviderId}</p>
                                    <p><strong>Hospital ID:</strong> {client.hospitalId}</p>
                                </div>
                                <div className="col-lg-6 col-md-6 col-sm-12">
                                    <div className="mb-3">
                                        <strong>Patient Details:</strong>
                                        <p>Name: {client.patientDetails.name}</p>
                                        <p>Email: {client.patientDetails.email}</p>
                                        <p>Aadhar: {client.patientDetails.aadhar}</p>
                                        <p>Mobile: {client.patientDetails.mobile}</p>
                                    </div>
                                    <div className="mb-3">
                                        <strong>Package Details:</strong>
                                        <p>Title: {client.packageDetails.title}</p>
                                        <p>Details: {client.packageDetails.details}</p>
                                        <p>Amount: {client.packageDetails.amount}</p>
                                        <p>Duration: {client.packageDetails.duration}</p>
                                    </div>
                                    <div className="mb-3">
                                        <strong>Hospital Details:</strong>
                                        <p>Name: {client.hospitalDetails.name}</p>
                                        <p>Email: {client.hospitalDetails.email}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center">
                                <img src={client.patientDetails.profileImage} alt="Profile" className="img-fluid img-thumbnail" />
                            </div>
                        </div>
                    </div>
                ))
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
