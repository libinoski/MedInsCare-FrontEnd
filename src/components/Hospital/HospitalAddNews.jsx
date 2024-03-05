import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './HospitalNavbar';
import Footer from '../Common/Footer';

const HospitalAddNews = () => {
    const navigate = useNavigate();
    const initialNewsData = {
        hospitalId: sessionStorage.getItem('hospitalId'),
        hospitalNewsTitle: '',
        hospitalNewsContent: '',
        hospitalNewsImage: null
    };
    const [newsData, setNewsData] = useState(initialNewsData);
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

    const resetForm = () => {
        setNewsData(initialNewsData);
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
            if (newsData.hospitalNewsImage) {
                formData.append('hospitalNewsImage', newsData.hospitalNewsImage);
            }
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
                resetForm();
                navigate('/hospitalViewAllNews');
            }
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                switch (status) {
                    case 400:
                        setValidationErrors(data.results || {});
                        break;
                    case 401:
                        alert(data.message);
                        break;
                    case 403:
                        alert(data.message || 'Unauthorized access. Please login again.');
                        navigate('/hospitalLogin');
                        break;
                    case 422:
                        alert(data.error || 'An error occurred while adding hospital news.');
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
            <Navbar />
            <div className="container-fluid" style={{ flex: 1, paddingTop: '56px', paddingBottom: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div className="row" style={{ width: '100%' }}>
                    <div className="col-lg-12 d-flex align-items-center justify-content-center">
                        <div className="container py-5">
                            <div className="card" style={{ boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', transition: '0.3s', borderRadius: '5px', ...(validationErrors && Object.keys(validationErrors).length > 0 ? { border: '1px solid #dc3545' } : {}) }}>
                                <div className="card-body">
                                    <form onSubmit={handleSubmit}>
                                        <div className="mb-3">
                                            <label htmlFor="hospitalNewsTitle" className="form-label">Title</label>
                                            <input type="text" className={`form-control ${validationErrors.hospitalNewsTitle ? 'is-invalid' : ''}`} id="hospitalNewsTitle" name="hospitalNewsTitle" value={newsData.hospitalNewsTitle} onChange={handleInputChange} />
                                            {validationErrors.hospitalNewsTitle && <div className="invalid-feedback">{validationErrors.hospitalNewsTitle}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="hospitalNewsContent" className="form-label">Content</label>
                                            <textarea className={`form-control ${validationErrors.hospitalNewsContent ? 'is-invalid' : ''}`} id="hospitalNewsContent" name="hospitalNewsContent" value={newsData.hospitalNewsContent} onChange={handleInputChange} rows="10" style={{ width: '100%', minHeight: '200px' }}></textarea>
                                            {validationErrors.hospitalNewsContent && <div className="invalid-feedback">{validationErrors.hospitalNewsContent}</div>}
                                        </div>
                                        <div className="mb-3">
                                            <label htmlFor="hospitalNewsImage" className="form-label">Image</label>
                                            <input type="file" className={`form-control ${validationErrors.hospitalNewsImage ? 'is-invalid' : ''}`} id="hospitalNewsImage" name="hospitalNewsImage" onChange={handleFileChange} />
                                            {validationErrors.hospitalNewsImage && <div className="invalid-feedback">{validationErrors.hospitalNewsImage}</div>}
                                        </div>
                                        <div className="text-center">
                                            <button type="submit" className="btn btn-primary" disabled={isLoading}>{isLoading ? 'Adding...' : 'Add News'}</button>
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

export default HospitalAddNews;
