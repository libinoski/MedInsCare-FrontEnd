import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Footer from '../Common/Footer';
import HospitalNavbar from './HospitalNavbar';

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
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>


{/* Navbar */}
    <HospitalNavbar />

    {/* Main content */}
    <div className="container py-5">
        <div className="row justify-content-center">
            <div className="col-md-8">
                <div className="card shadow-sm" style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', backdropFilter: 'blur(10px)', borderRadius: '20px' }}>
                    <div className="card-body">
                        <form onSubmit={handleImageUpload} encType="multipart/form-data">
                            {currentImage && (
                                <div className="mb-3 d-flex justify-content-center">
                                    <img
                                        src={currentImage}
                                        alt="Current"
                                        className="img-thumbnail"
                                        style={{ maxWidth: '500px', maxHeight: '300px', borderRadius: '10px', objectFit: 'cover', display: 'block' }}
                                    />
                                </div>
                            )}
                            <div className="mb-3">
                                <label htmlFor="hospitalImage" className="form-label">Choose New Image:</label>
                                <input
                                    type="file"
                                    className={`form-control ${validationErrors.hospitalImage ? 'is-invalid' : ''}`}
                                    id="hospitalImage"
                                    ref={fileInputRef}
                                    style={{ borderRadius: '5px' }}
                                />
                                {validationErrors.hospitalImage && (
                                    <div className="invalid-feedback">{validationErrors.hospitalImage}</div>
                                )}
                            </div>
                            <div className="d-flex justify-content-center gap-3 mt-4">
                            <button
    type="submit"
    className="btn btn-outline-secondary text-dark d-flex justify-content-center align-items-center"
    style={{
        border: '2px solid #6c757d',
        color: '#6c757d',
        fontWeight: 'bold',
        boxShadow: '0px 4px 8px rgba(108, 117, 125, 0.6)',
        padding: '10px 20px',
        borderRadius: '25px',
        width: '100%',
        maxWidth: '200px',
        textDecoration: 'none'
    }}
    disabled={isLoading}
>
    {isLoading ? 'Uploading...' : 'Upload'}
</button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>

    {/* Footer */}
    <Footer />
</div>


    );
};

export default HospitalChangeImage;
