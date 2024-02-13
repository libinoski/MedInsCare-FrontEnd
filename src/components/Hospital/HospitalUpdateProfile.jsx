import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/Hospital/HospitalUpdateProfile.css';

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
        <div className="hospital-update-profile-container">
            <div className="hospital-update-profile-card">
                <h2 className="hospital-update-profile-title">Update Profile</h2>
                <form onSubmit={handleSubmit} noValidate className="hospital-update-profile-form">
                    <div className="form-group">
                        <label>Hospital Name:</label>
                        <input
                            type="text"
                            name="hospitalName"
                            value={hospitalProfile.hospitalName}
                            onChange={handleInputChange}
                            className={`form-control ${errorMessages.hospitalName ? 'error' : ''}`}
                            required
                        />
                        {errorMessages.hospitalName && <p className="error">{errorMessages.hospitalName}</p>}
                    </div>
                    <div className="form-group">
                        <label>Website:</label>
                        <input
                            type="text"
                            name="hospitalWebSite"
                            value={hospitalProfile.hospitalWebSite}
                            onChange={handleInputChange}
                            className={`form-control ${errorMessages.hospitalWebSite ? 'error' : ''}`}
                            required
                        />
                        {errorMessages.hospitalWebSite && <p className="error">{errorMessages.hospitalWebSite}</p>}
                    </div>
                    <div className="form-group">
                        <label>Aadhar:</label>
                        <input
                            type="text"
                            name="hospitalAadhar"
                            value={hospitalProfile.hospitalAadhar}
                            onChange={handleInputChange}
                            className={`form-control ${errorMessages.hospitalAadhar ? 'error' : ''}`}
                            required
                        />
                        {errorMessages.hospitalAadhar && <p className="error">{errorMessages.hospitalAadhar}</p>}
                    </div>
                    <div className="form-group">
                        <label>Mobile:</label>
                        <input
                            type="text"
                            name="hospitalMobile"
                            value={hospitalProfile.hospitalMobile}
                            onChange={handleInputChange}
                            className={`form-control ${errorMessages.hospitalMobile ? 'error' : ''}`}
                            required
                        />
                        {errorMessages.hospitalMobile && <p className="error">{errorMessages.hospitalMobile}</p>}
                    </div>
                    <div className="form-group">
                        <label>Address:</label>
                        <input
                            type="text"
                            name="hospitalAddress"
                            value={hospitalProfile.hospitalAddress}
                            onChange={handleInputChange}
                            className={`form-control ${errorMessages.hospitalAddress ? 'error' : ''}`}
                            required
                        />
                        {errorMessages.hospitalAddress && <p className="error">{errorMessages.hospitalAddress}</p>}
                    </div>
                    <div className="form-footer">
                        <button type="submit" className={`btn-primary ${Object.keys(errorMessages).length > 0 ? 'error' : ''}`} disabled={isLoading}>
                            {isLoading ? 'Updating Profile...' : 'Update Profile'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default HospitalUpdateProfile;
