import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';
import backgroundImage from '../../images/Hospital/hr.jpg'; // Import the background image

const HospitalChangeImage = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});
    const [currentImage, setCurrentImage] = useState('');
    const fileInputRef = useRef(null);

    useEffect(() => {
        const fetchCurrentImage = async () => {
            try {
                const token = sessionStorage.getItem('token');
                const hospitalId = sessionStorage.getItem('hospitalId');
                const response = await axios.post(
                    'http://localhost:1313/api/mic/hospital/hospitalViewProfile',
                    { hospitalId },
                    { headers: { token } }
                );
                if (response.status === 200) {
                    setCurrentImage(response.data.data.hospitalImage);
                }
            } catch (error) {
                console.error('Error fetching current image:', error);
            }
        };

        fetchCurrentImage();
    }, []);

    const handleImageUpload = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setIsLoading(true);
        setValidationErrors({});

        try {
            const token = sessionStorage.getItem('token');
            const hospitalId = sessionStorage.getItem('hospitalId');
            const formData = new FormData();
            formData.append('hospitalImage', fileInputRef.current.files[0]);
            formData.append('hospitalId', hospitalId);

            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/hospitalChangeImage',
                formData,
                { headers: { 'Content-Type': 'multipart/form-data', 'token': token } }
            );

            if (response.status === 200) {
                alert(response.data.message);
                navigate('/hospitalViewProfile');
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        setValidationErrors(data.results || {});
                        break;
                    case 401:
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 422:
                        alert(data.error || 'An error occurred during image update.');
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
        <div>
            <Navbar />
            <div
                className="container-fluid bg-blur"
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    minHeight: '100vh',
                    paddingTop: '56px',
                    position: 'relative',
                }}
            >
                <div className="container py-5">
                    <div className="row justify-content-center">
                        <div className="col-md-8">
                            <div className="card transparent-card">
                                <div className="card-body">
                                    <form onSubmit={handleImageUpload} encType="multipart/form-data">
                                        <div className="row mb-3 justify-content-center">
                                            <div className="col-md-6">
                                                {currentImage && (
                                                    <img
                                                        src={currentImage}
                                                        alt="Current Hospital"
                                                        className="img-fluid img-preview"
                                                    />
                                                )}
                                            </div>
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="hospitalImage" className="form-label">Choose New Image:</label>
                                            <input
                                                type="file"
                                                className={`form-control ${validationErrors.hospitalImage ? 'is-invalid' : ''}`}
                                                id="hospitalImage"
                                                ref={fileInputRef}
                                            />
                                            {validationErrors.hospitalImage && (
                                                <div className="invalid-feedback">{validationErrors.hospitalImage}</div>
                                            )}
                                        </div>
                                        <div className="d-grid mt-4">
                                            <button type="submit" className={`btn btn-${Object.keys(validationErrors).length ? 'danger' : 'success'}`} disabled={isLoading} style={{width: '100px'}}>
                                                {isLoading ? 'Uploading Image...' : 'Upload'}
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

export default HospitalChangeImage;
