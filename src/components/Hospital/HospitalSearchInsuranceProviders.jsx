import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

const HospitalSearchInsuranceProviders = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResult, setSearchResult] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchExecuted, setSearchExecuted] = useState(false);

    const handleSearch = async () => {
        setIsLoading(true);
        setSearchExecuted(true);
        try {
            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/searchInsuranceProviders',
                { hospitalId, searchQuery },
                { headers: { token } }
            );
            if (response.status === 200) {
                setSearchResult(response.data.data);
            }
        } catch (error) {
            handleErrorResponse(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleErrorResponse = (error) => {
        if (error.response) {
            const { status, data } = error.response;
            switch (status) {
                case 400:
                    alert(data.message || 'Bad request. Please check your input.');
                    break;
                case 401:
                case 403:
                    alert(data.message || 'Unauthorized access. Please login again.');
                    navigate('/hospitalLogin');
                    break;
                case 422:
                    alert(data.message || 'No insurance providers found.');
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
        setSearchResult([]);
    };

    const handleViewProvider = (insuranceProviderId) => {
        sessionStorage.setItem('insuranceProviderId', insuranceProviderId);
        navigate('/viewInsuranceProvider');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <div className="container flex-grow-1 mt-4">
                <div className="row justify-content-center mb-5">
                    <div className="col-lg-8 col-md-12 col-12">
                        <div className="input-group" style={{ width: '100%' }}>
                            <input
                                type="text"
                                className="form-control py-3"
                                placeholder="Enter search query"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                style={{
                                    borderRadius: '30px 0 0 30px',
                                    fontSize: '1.2rem',
                                    padding: '15px 20px',
                                    height: 'auto',
                                }}
                            />
                            <div className="input-group-append">
                                <button
                                    className="btn btn-primary px-5 py-3"
                                    type="button"
                                    onClick={handleSearch}
                                    style={{
                                        borderRadius: '0 30px 30px 0',
                                        fontSize: '1.2rem',
                                        padding: '15px 30px',
                                        height: 'auto',
                                    }}
                                >
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                {isLoading ? (
                    <p className="text-center">Searching insurance providers...</p>
                ) : (
                    <>
                        {searchResult.length > 0 ? (
                            <div className="row justify-content-center">
                                {searchResult.map((provider, index) => (
                                    <div className="col-lg-3 col-md-4 col-12 mb-4" key={index}>
                                        <div
                                            className="card"
                                            style={{
                                                backgroundColor: 'white',
                                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                                                transition: 'border-color 0.3s ease',
                                                textAlign: 'center',
                                                height: '100%',
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.borderColor = 'blue';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.borderColor = 'transparent';
                                            }}
                                            onClick={() => handleViewProvider(provider.insuranceProviderId)}
                                        >
                                            <div className="card-body" style={{ border: '2px solid transparent', padding: '20px', height: '100%' }}>
                                                <div className="mb-4">
                                                    <img
                                                        src={provider.insuranceProviderProfileImage}
                                                        alt="Provider Logo"
                                                        style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                                                    />
                                                </div>
                                                <h5 className="card-title mb-4" style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>
                                                    {provider.insuranceProviderName}
                                                </h5>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : searchExecuted && <p className="text-center">No insurance providers found.</p>}
                    </>
                )}
            </div>
            <Footer />
        </div>
    );
};

export default HospitalSearchInsuranceProviders;
