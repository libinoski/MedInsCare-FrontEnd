import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const HospitalUpdateProfile = () => {
    const navigate = useNavigate();
    const [hospitalProfile, setHospitalProfile] = useState({
        hospitalName: '',
        hospitalWebSite: '',
        hospitalAadhar: '',
        hospitalMobile: '',
        hospitalAddress: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/hospitalViewProfile',
                    { hospitalId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    const { hospitalName, hospitalWebSite, hospitalAadhar, hospitalMobile, hospitalAddress } = response.data.data;
                    setHospitalProfile({
                        hospitalName,
                        hospitalWebSite,
                        hospitalAadhar,
                        hospitalMobile,
                        hospitalAddress,
                    });
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
                            const errorMessage422 = data.error || "An error occurred during profile view.";
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

        fetchProfile();
    }, [navigate]);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setHospitalProfile({ ...hospitalProfile, [name]: value });
        if (errorMessages[name]) {
            setErrorMessages({ ...errorMessages, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessages({});

        try {
            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const response = await axios.post('http://localhost:1313/api/mic/hospital/hospitalUpdateProfile', { ...hospitalProfile, hospitalId }, {
                headers: {
                    'token': token,
                },
            });
            if (response.status === 200) {
                alert(response.data.message);
                navigate('/hospitalViewProfile');
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        setErrorMessages(data.results || {});
                        break;
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 422:
                        const errorMessage = data.error || "An error occurred during profile update.";
                        alert(errorMessage);
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

    return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
            <div className="card" style={{ maxWidth: "600px", width: "100%", margin: "auto" }}>
                <h2 className="card-header text-center">Update Profile</h2>
                <div className="card-body">
                    <form onSubmit={handleSubmit} noValidate>
                        <div className="mb-3">
                            <label htmlFor="hospitalName" className="form-label">Hospital Name:</label>
                            <input
                                type="text"
                                name="hospitalName"
                                value={hospitalProfile.hospitalName}
                                onChange={handleInputChange}
                                className={`form-control ${errorMessages.hospitalName ? 'is-invalid' : ''}`}
                                id="hospitalName"
                                required
                            />
                            {errorMessages.hospitalName && <div className="invalid-feedback">{errorMessages.hospitalName}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="hospitalWebSite" className="form-label">Website:</label>
                            <input
                                type="text"
                                name="hospitalWebSite"
                                value={hospitalProfile.hospitalWebSite}
                                onChange={handleInputChange}
                                className={`form-control ${errorMessages.hospitalWebSite ? 'is-invalid' : ''}`}
                                id="hospitalWebSite"
                                required
                            />
                            {errorMessages.hospitalWebSite && <div className="invalid-feedback">{errorMessages.hospitalWebSite}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="hospitalAadhar" className="form-label">Aadhar:</label>
                            <input
                                type="text"
                                name="hospitalAadhar"
                                value={hospitalProfile.hospitalAadhar}
                                onChange={handleInputChange}
                                className={`form-control ${errorMessages.hospitalAadhar ? 'is-invalid' : ''}`}
                                id="hospitalAadhar"
                                required
                            />
                            {errorMessages.hospitalAadhar && <div className="invalid-feedback">{errorMessages.hospitalAadhar}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="hospitalMobile" className="form-label">Mobile:</label>
                            <input
                                type="text"
                                name="hospitalMobile"
                                value={hospitalProfile.hospitalMobile}
                                onChange={handleInputChange}
                                className={`form-control ${errorMessages.hospitalMobile ? 'is-invalid' : ''}`}
                                id="hospitalMobile"
                                required
                            />
                            {errorMessages.hospitalMobile && <div className="invalid-feedback">{errorMessages.hospitalMobile}</div>}
                        </div>
                        <div className="mb-3">
                            <label htmlFor="hospitalAddress" className="form-label">Address:</label>
                            <input
                                type="text"
                                name="hospitalAddress"
                                value={hospitalProfile.hospitalAddress}
                                onChange={handleInputChange}
                                className={`form-control ${errorMessages.hospitalAddress ? 'is-invalid' : ''}`}
                                id="hospitalAddress"
                                required
                            />
                            {errorMessages.hospitalAddress && <div className="invalid-feedback">{errorMessages.hospitalAddress}</div>}
                        </div>
                        <div className="d-flex justify-content-center mt-4">
                            <button type="submit" className="btn btn-primary btn-sm" disabled={isLoading}>
                                {isLoading ? 'Updating Profile...' : 'Update'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default HospitalUpdateProfile;