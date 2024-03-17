import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/Hospital/hospital.svg'; // Import the background image
import HospitalNavbar from './HospitalNavbar';

const HospitalUpdateNews = () => {
    const navigate = useNavigate();
    const [newsData, setNewsData] = useState({
        hospitalNewsTitle: '',
        hospitalNewsContent: '',
        hospitalNewsImage: null,
        existingImageUrl: '', // Store existing image URL
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessages, setErrorMessages] = useState({});

    useEffect(() => {
        const fetchNewsData = async () => {
            setIsLoading(true);
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const hospitalNewsId = sessionStorage.getItem('hospitalNewsId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/viewOneHospitalNews',
                    { hospitalId, hospitalNewsId },
                    {
                        headers: {
                            token
                        }
                    }
                );
                if (response.status === 200) {
                    const { hospitalNewsTitle, hospitalNewsContent, hospitalNewsImage } = response.data.data;
                    setNewsData(prevData => ({
                        ...prevData,
                        hospitalNewsTitle,
                        hospitalNewsContent,
                        existingImageUrl: hospitalNewsImage, // Set existing image URL
                    }));
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
                            const errorMessage422 = data.error || "An error occurred during news view.";
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

        fetchNewsData();
    }, [navigate, setNewsData]); // Include navigate and setNewsData in the dependency array

    const handleInputChange = (event) => {
        const { name, value, files } = event.target;
        if (name === 'hospitalNewsImage') {
            setNewsData(prevData => ({ ...prevData, hospitalNewsImage: files[0] }));
        } else {
            setNewsData(prevData => ({ ...prevData, [name]: value }));
        }
        if (errorMessages[name]) {
            setErrorMessages({ ...errorMessages, [name]: '' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessages({});

        try {
            // Check if there are any validation errors
            if (Object.keys(errorMessages).length === 0) {
                // If no validation errors, show confirmation dialog
                const confirmed = window.confirm("Are you sure you want to update?");
                if (!confirmed) {
                    setIsLoading(false);
                    return;
                }
            }

            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const hospitalNewsId = sessionStorage.getItem('hospitalNewsId');
            const formData = new FormData();
            formData.append('hospitalId', hospitalId);
            formData.append('hospitalNewsId', hospitalNewsId);
            formData.append('hospitalNewsTitle', newsData.hospitalNewsTitle);
            formData.append('hospitalNewsContent', newsData.hospitalNewsContent);
            formData.append('hospitalNewsImage', newsData.hospitalNewsImage);
            
            const response = await axios.post('http://localhost:1313/api/mic/hospital/updateHospitalNews', formData, {
                headers: {
                    'token': token,
                    'Content-Type': 'multipart/form-data'
                },
            });
            if (response.status === 200) {
                // alert(response.data.message);
                navigate('/hospitalViewAllNews');
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
                        const errorMessage = data.error || "An error occurred during news update.";
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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

{/* Navbar */}
    <HospitalNavbar />
    <div className="container-fluid bg-blur" style={{ minHeight: '100vh', paddingTop: '56px', position: 'relative' }}>
        <div className="container py-5">
            <div className="row">

                {/* Left Side Image Container */}
                <div className="col-lg-6 d-flex align-items-center justify-content-center">
                    <img src={backgroundImage} className="img-fluid" alt="Background" style={{ maxHeight: '100%', maxWidth: '100%' }} />
                </div>

                {/* Right Side Profile Details Card */}
                <div className="col-lg-6 d-flex align-items-center justify-content-center">
                    <div className="card" style={{ backgroundColor: 'rgba(255, 255, 255, 0.5)' }}>
                        <div className="card-body">
                            <form onSubmit={handleSubmit} noValidate>
                                <div className="mb-3">
                                    <label htmlFor="hospitalNewsTitle" className="form-label">News Title:</label>
                                    <input
                                        type="text"
                                        name="hospitalNewsTitle"
                                        value={newsData.hospitalNewsTitle}
                                        onChange={handleInputChange}
                                        className={`form-control ${errorMessages.hospitalNewsTitle ? 'is-invalid' : ''}`}
                                        id="hospitalNewsTitle"
                                        required
                                    />
                                    {errorMessages.hospitalNewsTitle && <div className="invalid-feedback">{errorMessages.hospitalNewsTitle}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="hospitalNewsContent" className="form-label">News Content:</label>
                                    <textarea
                                        name="hospitalNewsContent"
                                        value={newsData.hospitalNewsContent}
                                        onChange={handleInputChange}
                                        className={`form-control ${errorMessages.hospitalNewsContent ? 'is-invalid' : ''}`}
                                        id="hospitalNewsContent"
                                        rows="5"
                                        required
                                    ></textarea>
                                    {errorMessages.hospitalNewsContent && <div className="invalid-feedback">{errorMessages.hospitalNewsContent}</div>}
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="hospitalNewsImage" className="form-label">News Image:</label>
                                    <input
                                        type="file"
                                        name="hospitalNewsImage"
                                        onChange={handleInputChange}
                                        className={`form-control ${errorMessages.hospitalNewsImage ? 'is-invalid' : ''}`}
                                        id="hospitalNewsImage"
                                    />
                                    {errorMessages.hospitalNewsImage && <div className="invalid-feedback">{errorMessages.hospitalNewsImage}</div>}
                                    {newsData.existingImageUrl && <img src={newsData.existingImageUrl} alt="Existing News" style={{ marginTop: '10px', maxWidth: '100%' }} />}
                                </div>
                                <div className="d-flex justify-content-center align-items-center" >
                                <button
    type="submit"
    class="btn btn-outline-secondary text-dark d-flex justify-content-center align-items-center"
    disabled={isLoading}
    style={{
        border: '2px solid #6c757d',
        color: '#6c757d',
        fontWeight: 'bold',
        boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
        padding: '10px 20px',
        borderRadius: '25px',
        width: '100px', // Maintaining the specified width
        textDecoration: 'none'
    }}
>
    {isLoading ? 'Updating News...' : 'Update'}
</button>

                                </div>
                            </form>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <Footer />
</div>

    );
};

export default HospitalUpdateNews;
