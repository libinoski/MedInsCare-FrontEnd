import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; 
import backgroundImage from '../../images/Hospital/bg1.jpg'; // Import the background image

import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

const HospitalAddNews = () => {
    const navigate = useNavigate();
    const [newsData, setNewsData] = useState({
        hospitalId: sessionStorage.getItem('hospitalId'),
        hospitalNewsTitle: '',
        hospitalNewsContent: '',
        hospitalNewsImage: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [validationErrors, setValidationErrors] = useState({});

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewsData({ ...newsData, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setNewsData({ ...newsData, hospitalNewsImage: file });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const token = sessionStorage.getItem('token');

            const formData = new FormData();
            formData.append('hospitalId', newsData.hospitalId);
            formData.append('hospitalNewsTitle', newsData.hospitalNewsTitle);
            formData.append('hospitalNewsContent', newsData.hospitalNewsContent);
            formData.append('hospitalNewsImage', newsData.hospitalNewsImage);

            const response = await axios.post(
                'http://localhost:1313/api/mic/hospital/addHospitalNews',
                formData,
                {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        token
                    }
                }
            );
            if (response.status === 200) {
                alert('Hospital news added successfully');
                navigate('/hospitalViewProfile');
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                if (status === 400) {
                    setValidationErrors(data.results || {});
                } else if (status === 401) {
                    alert(data.message);
                } else if (status === 403) {
                    alert(data.message || 'Unauthorized access. Please login again.');
                    navigate('/hospitalLogin');
                } else if (status === 422) {
                    alert(data.error || 'An error occurred while adding hospital news.');
                } else if (status === 500) {
                    alert(data.message || 'Internal server error. Please try again later.');
                } else {
                    alert('An error occurred. Please try again.');
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
    <div className="container-fluid" style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '100vh', paddingTop: '56px' }}>
        <div className="container py-5">
            <div className="card">
                <div className="card-body">
                    <h2 className="card-title text-center mb-4">Add Hospital News</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label htmlFor="hospitalNewsTitle" className="form-label">Title</label>
                            <input
                                type="text"
                                className={`form-control ${validationErrors.hospitalNewsTitle ? 'is-invalid' : ''}`}
                                id="hospitalNewsTitle"
                                name="hospitalNewsTitle"
                                value={newsData.hospitalNewsTitle}
                                onChange={handleInputChange}
                            />
                            {validationErrors.hospitalNewsTitle && (
                                <div className="invalid-feedback">{validationErrors.hospitalNewsTitle}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="hospitalNewsContent" className="form-label">Content</label>
                            <textarea
                                className={`form-control ${validationErrors.hospitalNewsContent ? 'is-invalid' : ''}`}
                                id="hospitalNewsContent"
                                name="hospitalNewsContent"
                                value={newsData.hospitalNewsContent}
                                onChange={handleInputChange}
                                rows="10"
                                style={{ width: '100%', minHeight: '200px' }} // Increased height for content input
                            ></textarea>
                            {validationErrors.hospitalNewsContent && (
                                <div className="invalid-feedback">{validationErrors.hospitalNewsContent}</div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="hospitalNewsImage" className="form-label">Image</label>
                            <input
                                className={`form-control ${validationErrors.hospitalNewsImage ? 'is-invalid' : ''}`}
                                type="file"
                                id="hospitalNewsImage"
                                name="hospitalNewsImage"
                                onChange={handleFileChange}
                            />
                            {validationErrors.hospitalNewsImage && (
                                <div className="invalid-feedback">{validationErrors.hospitalNewsImage}</div>
                            )}
                        </div>

                        <div className="text-center">
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? 'Adding...' : 'Add News'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</div>





    );
};

export default HospitalAddNews;
