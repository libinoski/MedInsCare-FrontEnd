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

    const handleViewClient = (clientId) => {
        sessionStorage.setItem('clientId', clientId);
        navigate('/insuranceProviderViewOneClient');
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <InsuranceProviderNavbar />
            <div className="flex-grow-1 container-fluid py-4">
                <div className="container">
                    {isLoading ? (
                        <p className="text-center">Loading clients...</p>
                    ) : clientList.length > 0 ? (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                            {clientList.map((client, index) => (
                                <div key={index} className="col">
                                    <div className="card h-100 shadow-sm" onClick={() => handleViewClient(client.clientId)}>
                                        <img
                                            src={client.clientProfileImage}
                                            className="card-img-top rounded-top"
                                            alt={client.clientName}
                                            style={{ objectFit: 'cover' }}
                                        />
                                        <div className="card-body d-flex flex-column justify-content-between">
                                            <div>
                                                <h5 className="card-title">{client.clientName}</h5>
                                                <p className="card-text">Email: {client.clientEmail}</p>
                                                <p className="card-text">Package Title: {client.packageTitle}</p>
                                                <p className="card-text">Package Details: {client.packageDetails}</p>
                                                <p className="card-text">Package Amount: {client.packageAmount}</p>
                                                <p className="card-text">Package Duration: {client.packageDuration}</p>
                                            </div>
                                            <div>
                                                <p className="card-text">Hospital: {client.hospitalName}</p>
                                                <p className="card-text">Hospital Email: {client.hospitalEmail}</p>
                                            </div>
                                        </div>
                                    </div>
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
