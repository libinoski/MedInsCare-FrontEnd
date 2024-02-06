import React, { useState } from 'react';
import axios from 'axios';
import '../../css/Hospital/HospitalLogin.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const HospitalLogin = () => {
  const initialLoginData = {
    hospitalEmail: '',
    hospitalPassword: '',
  };

  const [loginData, setLoginData] = useState(initialLoginData);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loginFailed, setLoginFailed] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const resetForm = () => {
    setLoginData(initialLoginData);
  };

  const displayPasswordValidationError = (message) => {
    alert(`Password validation failed: ${message}`);
  };

  const handleServerError = (errorMessage) => {
    alert(errorMessage);
    setLoginFailed(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setValidationErrors({});
    setLoginFailed(false);

    try {
      const response = await axios.post('http://localhost:1313/api/mic/hospital/hospitalLogin', loginData);

      switch (response.status) {
        case 200:
          // Assuming the response contains hospitalId and token
          const { hospitalId, token } = response.data.data;

          // Set hospitalId and token in sessionStorage
          sessionStorage.setItem('hospitalId', hospitalId);
          sessionStorage.setItem('token', token);

          alert('Login successful');
          resetForm();
          // Redirect or additional actions here
          break;
        default:
          alert('Unexpected server response');
          setLoginFailed(true);
          break;
      }
    } catch (error) {
      setLoginFailed(true);
      if (error.response) {
        switch (error.response.status) {
          case 400:
            const errors = error.response.data.details;
            const newValidationErrors = {};
            errors.forEach((err) => {
              newValidationErrors[err.field] = err.message;
              if (err.field === 'hospitalPassword') {
                displayPasswordValidationError(err.message);
              }
            });
            setValidationErrors(newValidationErrors);
            break;
          case 401:
            handleServerError('Wrong password.');
            break;
          case 403:
            handleServerError('Access to the login feature is restricted.');
            break;
          case 404:
            handleServerError('Hospital not found.');
            break;
          case 500:
            handleServerError('Internal server error. Please try again later.');
            break;
          default:
            handleServerError('An error occurred. Please try again.');
            break;
        }
      } else {
        handleServerError('An error occurred. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div className="hospital-login-container">
      <div className="card hospital-login-card">
        <div className="card-body">
          <h1 className="card-title hospital-login-title text-center">ADMIN PORTAL</h1>
          <form onSubmit={handleSubmit} noValidate className="hospital-login-form">
            {loginFailed && (
            <div className="alert alert-danger text-center">Login failed. Please try again.</div>

            )}

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
              <div className="password-container">
                <input
                  type={passwordVisible ? 'text' : 'password'}
                  className={`form-control`}
                  id="hospitalPassword"
                  name="hospitalPassword"
                  value={loginData.hospitalPassword}
                  onChange={handleChange}
                  placeholder="Enter Password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                </button>
              </div>
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

