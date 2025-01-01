import React, { useState } from 'react';
import axios from 'axios';

function GenerateStatisticsModal({ show, onClose }) {
  const [formData, setFormData] = useState({
    date: '',
    startTime: '',
    endTime: '',
    interval: '',
  });

  const [loading, setLoading] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const formatTime = (time) => (time.length === 5 ? `${time}:00` : time); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMessage('');

    try {
      const formattedData = {
        ...formData,
        startTime: formatTime(formData.startTime),
        endTime: formatTime(formData.endTime),
      };

      const response = await axios.post('http://localhost:8080/getStatistics', formattedData);
      setResponseMessage('Statistics generated successfully.');
    } catch (error) {
      console.error('Error generating statistics:', error);
      setResponseMessage('Failed to generate statistics. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!show) {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          width: '400px',
          textAlign: 'center',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        <h2 style={{ color: '#000', marginBottom: '20px' }}>Generate Statistics</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#000' }}>Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#000' }}>Start Time</label>
            <input
              type="time"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#000' }}>End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              required
            />
          </div>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', marginBottom: '5px', color: '#000' }}>Interval</label>
            <input
              type="text"
              name="interval"
              value={formData.interval}
              onChange={handleChange}
              placeholder="HH:mm:ss"
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #ccc',
                borderRadius: '4px',
              }}
              required
            />
          </div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#000',
              color: '#F9D342',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginRight: '10px',
            }}
            disabled={loading}
          >
            {loading ? 'Generating...' : 'Submit'}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ccc',
              color: '#000',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Close
          </button>
        </form>
        {responseMessage && (
          <p
            style={{
              marginTop: '20px',
              color: responseMessage.startsWith('Failed') ? 'red' : 'green',
            }}
          >
            {responseMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default GenerateStatisticsModal;
