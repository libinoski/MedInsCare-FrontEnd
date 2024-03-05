import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HospitalStaffNavbar from './HospitalStaffNavbar';
import Footer from '../Common/Footer';

const HospitalStaffRequestDischarge = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleSubmit = async (event) => {
    event.preventDefault();
    const confirmed = window.confirm("Are you sure you want to submit this discharge request?");
    if (!confirmed) return;

    setIsLoading(true);
    try {
      const token = sessionStorage.getItem('token'); // Make sure to adjust this based on your authentication setup
      const hospitalStaffId = sessionStorage.getItem('hospitalStaffId');
      const patientId = sessionStorage.getItem('patientId');

      const response = await axios.post(
        'http://localhost:1313/api/mic/hospitalStaff/hospitalStaffRequestDischarge',
        { hospitalStaffId, patientId, message },
        {
          headers: {
            'token': token,
            'Content-Type': 'application/json'
          },
        }
      );

      if (response.status === 200) {
        alert(response.data.message);
        navigate('/hospitalStaffViewAllPatients');

      }
    } catch (error) {
      if (error.response) {
        const { status, data } = error.response;
        switch (status) {
          case 400:
            setErrors(data.errors || {});
            break;
          case 401:
          case 403:
            alert(data.message || 'Unauthorized access. Please log in again.');
            navigate('/hospitalLogin');
            break;
          case 422:
            alert(data.error || 'Hospital staff not found or not active, or patient not found or already discharged.');
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
      <HospitalStaffNavbar />
      <div className="container-fluid py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="card bg-transparent border-0">
                <div className="card-body rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', boxShadow: '0 0 20px rgba(255, 255, 255, 0.1)' }}>
                  <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                      <label htmlFor="message" className="form-label">Discharge Message</label>
                      <textarea
                        className={`form-control ${errors.message ? 'is-invalid' : ''}`}
                        id="message"
                        rows="5"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        required
                      ></textarea>
                      {errors.message && <div className="invalid-feedback">{errors.message}</div>}
                    </div>
                    <div className="text-center">
                      <button type="submit" className={`btn ${isLoading ? 'btn-secondary' : 'btn-primary'}`} disabled={isLoading}>
                        {isLoading ? 'Submitting...' : 'Submit Request'}
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

export default HospitalStaffRequestDischarge;
