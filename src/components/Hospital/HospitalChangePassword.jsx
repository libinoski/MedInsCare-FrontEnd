import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = sessionStorage.getItem('token');
    const hospitalId = sessionStorage.getItem('hospitalId'); // Get hospitalId from sessionStorage

    const headers = {
      'Content-Type': 'application/json;charset=UTF-8',
      'Access-Control-Allow-Origin': '*',
      token, 
    };
    console.log('Headers:', headers);


    try {
      const response = await axios.post(
        'http://localhost:1313/api/mic/hospital/hospitalChangePassword',
        {
          hospitalId, // Use hospitalId from sessionStorage
          oldPassword,
          newPassword,
        },
        {
          headers,
        }
      );

      switch (response.status) {
        case 200:
          setSuccessMessage(response.data.message);
          break;
        case 400:
          if (response.data.status === 'Validation failed') {
            const validationMessages = response.data.messages;
            validationMessages.forEach((message) => {
              console.log(`Validation failed for ${message.field}: ${message.message}`);
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
        case 404:
          alert(response.data.message);
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

      if (error.message === 'Hospital not found' || error.message === 'Invalid old password') {
        alert(error.message);
      } else {
        alert('An error occurred: Network error');
      }
    }
  };

  return (
    <div>
      <h2>Change Password</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="oldPassword">Old Password:</label>
          <input type="password" id="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
        </div>
        <div>
          <label htmlFor="newPassword">New Password:</label>
          <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <button type="submit">Change Password</button>
      </form>
      {successMessage && <div className="success-message">{successMessage}</div>}
    </div>
  );
};

export default ChangePassword;
