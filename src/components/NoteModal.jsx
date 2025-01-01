import React, { useState } from 'react';

function NoteModal({ isOpen, transaction, onClose, onSave }) {
  if (!isOpen || !transaction) return null;

  const { transactionId, transactionDate, transactionType, amount, note, responseCode } = transaction;

  const [editableNote, setEditableNote] = useState(note || ''); 
  const [responseMessage, setResponseMessage] = useState(''); 
  const [loading, setLoading] = useState(false); 

  const handleSave = async () => {
    setLoading(true);
    setResponseMessage('');

    try {
      if (onSave) {
        await onSave(transactionId, editableNote); 
        setResponseMessage('Note updated successfully.');
      }
    } catch (error) {
      setResponseMessage('Failed to update note. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <h2 style={{ color: '#000', marginBottom: '20px' }}>Transaction Details</h2>
        <div style={{ textAlign: 'left', marginBottom: '20px' }}>
          <div style={{ marginBottom: '10px' }}>
            <strong>ID:</strong> {transactionId}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Date:</strong> {transactionDate}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Type:</strong> {transactionType}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Amount:</strong> RM {amount.toFixed(2)}
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Note:</strong>
            <textarea
              value={editableNote}
              onChange={(e) => setEditableNote(e.target.value)}
              style={{
                width: '100%',
                padding: '5px',
                marginTop: '5px',
                fontSize: '14px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                resize: 'none',
              }}
              rows="3"
            />
          </div>
          <div style={{ marginBottom: '10px' }}>
            <strong>Resp. Code:</strong> {responseCode}
          </div>
        </div>

        <div>
          <button
            onClick={onClose}
            style={{
              padding: '10px 20px',
              backgroundColor: '#ccc',
              color: '#000',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              marginRight: '10px',
            }}
          >
            Close
          </button>
          <button
            onClick={handleSave}
            style={{
              padding: '10px 20px',
              backgroundColor: '#28a745',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: 'bold',
            }}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>

        {responseMessage && (
          <p
            style={{
              marginTop: '20px',
              color: responseMessage.startsWith('Failed') ? 'red' : 'green',
              fontSize: '14px',
            }}
          >
            {responseMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default NoteModal;
