import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../css/Hospital/HospitalChangePassword.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

const HospitalChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem('token');
    const hospitalId = sessionStorage.getItem('hospitalId');

    const headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      token, 
    };

    try {
      const response = await axios.post(
        'http://localhost:1313/api/mic/hospital/hospitalChangePassword',
        {
          hospitalId,
          oldPassword,
          newPassword,
        },
        {
          headers,
        }
      );

      switch (response.status) {
        case 200:
          alert(response.data.message);
          navigate('/hospitalLogin');
          break;
        case 400:
          if (response.data.status === 'Validation failed') {
            const validationMessages = response.data.messages;
            validationMessages.forEach((message) => {
              alert(`Validation failed for ${message.field}: ${message.message}`);
            });
          } else {
            alert(`Failed to change password: ${response.data.message}`);
          }
          break;
        case 401:
        case 403:
          alert(`Token error: ${response.data.message}`);
          navigate('/hospitalLogin');
          break;
        case 500:
          alert(`Failed to change password: ${response.data.message}`);
          break;
        default:
          alert(`An error occurred: Status ${response.status}`);
          break;
      }
    } catch (error) {
      console.error('Error changing hospital password:', error);

      if (error.response && error.response.status === 400 && error.response.data.status === 'Validation failed') {
        const validationMessages = error.response.data.messages;
        validationMessages.forEach((message) => {
          alert(`Validation failed for ${message.field}: ${message.message}`);
        });
      } if (error.response && error.response.status === 404) {
        alert(error.response.data.message);
      } else {
        alert('An error occurred: Network error');
      }
    }
  };
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };



  return (
    <div className="hospital-change-password-container">
      <div className="card hospital-change-password-card">
        <div className="card-body">
          <h2 className="card-title hospital-change-password-title">Change Password</h2>
          <form onSubmit={handleSubmit} className="hospital-change-password-form">
            <div className="form-group">
              <label htmlFor="oldPassword">Old Password:</label>
              <div className="password-container">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  id="oldPassword"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  className="form-control"
                />
                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="newPassword">New Password:</label>
              <div className="password-container">
                <input
                  type={isPasswordVisible ? 'text' : 'password'}
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-control"
                />
                <button
                  type="button"
                  className="password-toggle-button"
                  onClick={togglePasswordVisibility}
                >
                  <FontAwesomeIcon icon={isPasswordVisible ? faEyeSlash : faEye} />
                </button>
              </div>
            </div>
            <button type="submit" className="btn btn-primary">
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HospitalChangePassword;

