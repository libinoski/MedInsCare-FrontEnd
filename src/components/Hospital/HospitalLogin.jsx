import React, { useState } from 'react';
import axios from 'axios';
import '../../css/Hospital/HospitalLogin.css';
import { useNavigate } from 'react-router-dom';

const HospitalLogin = () => {
  const navigate = useNavigate();
  const initialLoginData = {
    hospitalEmail: '',
    hospitalPassword: '',
  };

  const [loginData, setLoginData] = useState(initialLoginData);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const resetForm = () => {
    setLoginData(initialLoginData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setValidationErrors({});

    try {
      const response = await axios.post('http://localhost:1313/api/mic/hospital/hospitalLogin', loginData);

      switch (response.status) {
        case 200:
          const { token, hospital, message } = response.data.data;

          sessionStorage.setItem('hospitalId', hospital.hospitalId);
          sessionStorage.setItem('token', token);

          alert(message); // Display message from backend
          resetForm();
          navigate('/hospitalChangePassword'); // Redirect to the next page
          break;
        default:
          alert('An unexpected response was received from the server');
          break;
      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
          case 422: // Handling validation errors
            const errors = data.results || {};
            // let errorMessage = "Please correct the following errors:\n";
            Object.keys(errors).forEach(key => {
              // errorMessage += `${key}: ${errors[key]}\n`;
            });
            // alert(errorMessage);
            setValidationErrors(errors);
            break;
          case 500:
            alert(data.message || 'Internal server error. Please try again later.');
            break;
          default:
            alert(data.message || 'An error occurred. Please try again.');
            break;
        }
      } else {
        alert('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="hospital-login-container">
      <div className="card hospital-login-card">
        <div className="card-body">
          <h1 className="card-title hospital-login-title text-center">ADMIN PORTAL</h1>
          <form onSubmit={handleSubmit} noValidate className="hospital-login-form">
            <div className="form-group">
              <label htmlFor="hospitalEmail">Email</label>
              <input
                type="email"
                className={`form-control ${validationErrors.hospitalEmail ? 'is-invalid' : ''}`}
                id="hospitalEmail"
                name="hospitalEmail"
                value={loginData.hospitalEmail}
                onChange={handleChange}
                placeholder="Enter Email"
                required
              />
              {validationErrors.hospitalEmail && (
                <div className="invalid-feedback">{validationErrors.hospitalEmail}</div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="hospitalPassword">Password</label>
              <input
                type="password"
                className={`form-control ${validationErrors.hospitalPassword ? 'is-invalid' : ''}`}
                id="hospitalPassword"
                name="hospitalPassword"
                value={loginData.hospitalPassword}
                onChange={handleChange}
                placeholder="Enter Password"
                required
              />
              {validationErrors.hospitalPassword && (
                <div className="invalid-feedback">{validationErrors.hospitalPassword}</div>
              )}
            </div>

            <div className="form-footer">
              <button
                type="submit"
                className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HospitalLogin;
