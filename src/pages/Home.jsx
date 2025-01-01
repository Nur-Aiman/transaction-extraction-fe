import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PumpTransactionsModal from '../components/PumpTransactionsModal';
import GenerateStatisticsModal from '../components/GenerateStatisticsModal';
import NoteModal from '../components/NoteModal';

function Home() {
  const [transactions, setTransactions] = useState([]);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  const [loading, setLoading] = useState(false);
  const [showPumpModal, setShowPumpModal] = useState(false);
  const [showStatisticsModal, setShowStatisticsModal] = useState(false);
  const [noteModal, setNoteModal] = useState({ isOpen: false, transaction: null });

  const fetchTransactions = async (page) => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/viewTransactions', {
        params: { page, size },
      });

      setTransactions(response.data);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(page);
  }, [page]);

  const openPumpModal = () => setShowPumpModal(true);
  const closePumpModal = () => setShowPumpModal(false);

  const openStatisticsModal = () => setShowStatisticsModal(true);
  const closeStatisticsModal = () => setShowStatisticsModal(false);

  const handleNext = () => setPage((prevPage) => prevPage + 1);
  const handlePrev = () => setPage((prevPage) => (prevPage > 0 ? prevPage - 1 : 0));

  const handleSaveNote = async (transactionId, updatedNote) => {
    try {
      const response = await axios.put(
        `http://localhost:8080/transactions/${transactionId}/updateNote`,
        null,
        { params: { note: updatedNote } }
      );
      console.log(response.data);

      fetchTransactions(page);
    } catch (error) {
      console.error('Error updating note:', error);
    }
  };

  const openNoteModal = (transaction) => {
    setNoteModal({ isOpen: true, transaction });
  };

  const closeNoteModal = () => {
    setNoteModal({ isOpen: false, transaction: null });
  };

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '20px',
        backgroundColor: '#F9D342',
        minHeight: '100vh',
        color: '#000',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#000', fontWeight: 'bold', marginBottom: '20px' }}>
          Transaction Extraction
        </h1>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button
            onClick={() =>
              window.open(
                process.env.REACT_APP_GOOGLE_SHEETS_LINK,
                '_blank'
              )
            }
            style={{
              padding: '10px 20px',
              backgroundColor: '#000',
              color: '#F9D342',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            View Statistics
          </button>

          <button
            onClick={openStatisticsModal}
            style={{
              padding: '10px 20px',
              backgroundColor: '#000',
              color: '#F9D342',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Generate Statistics
          </button>
          <button
            onClick={openPumpModal}
            style={{
              padding: '10px 20px',
              backgroundColor: '#000',
              color: '#F9D342',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Pump Transactions
          </button>
        </div>
      </div>

      {loading ? (
        <p style={{ fontSize: '18px', fontWeight: 'bold' }}>Loading...</p>
      ) : (
        <div>
          <table
            style={{
              margin: '0 auto',
              border: '1px solid #000',
              borderCollapse: 'collapse',
              width: '80%',
              backgroundColor: '#fff',
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
            }}
          >
            <thead style={{ backgroundColor: '#000', color: '#F9D342' }}>
              <tr>
                <th style={{ border: '1px solid #000', padding: '12px' }}>ID</th>
                <th style={{ border: '1px solid #000', padding: '12px' }}>Date</th>
                <th style={{ border: '1px solid #000', padding: '12px' }}>Transaction Type</th>
                <th style={{ border: '1px solid #000', padding: '12px' }}>Amount (RM)</th>
                <th style={{ border: '1px solid #000', padding: '12px', position: 'relative' }}>
                  Note
                  <i
                    className="fas fa-pencil-alt"
                    style={{
                      fontSize: '14px',
                      marginLeft: '7px',
                      color: '#F9D342',
                      position: 'absolute',
                      right: '-1px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                    }}
                  ></i>
                </th>
                <th style={{ border: '1px solid #000', padding: '12px' }}>Response Code</th>
              </tr>
            </thead>

            <tbody>
              {transactions.length > 0 ? (
                transactions.map((transaction, index) => (
                  <tr key={index} style={{ textAlign: 'center' }}>
                    <td style={{ border: '1px solid #000', padding: '12px' }}>
                      {transaction.transactionId}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '12px' }}>
                      {transaction.transactionDate}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '12px' }}>
                      {transaction.transactionType}
                    </td>
                    <td style={{ border: '1px solid #000', padding: '12px' }}>
                      {transaction.amount.toFixed(2)}
                    </td>
                    <td
                      style={{
                        border: '1px solid #000',
                        padding: '12px',
                        maxWidth: '200px',
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        position: 'relative',
                      }}
                    >
                      {transaction.note}
                      <i
                        className="fas fa-pencil-alt"
                        onClick={() => openNoteModal(transaction)}
                        style={{
                          fontSize: '14px',
                          color: 'black',
                          cursor: 'pointer',
                          position: 'absolute',
                          right: '10px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                        }}
                      ></i>
                    </td>
                    <td style={{ border: '1px solid #000', padding: '12px' }}>
                      {transaction.responseCode}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  
                  <td colSpan="6" style={{ border: '1px solid #000', padding: '12px' }}>
                    No transactions available
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
            <button
              onClick={handlePrev}
              disabled={page === 0}
              style={{
                padding: '10px 20px',
                backgroundColor: '#000',
                color: '#F9D342',
                border: 'none',
                cursor: page === 0 ? 'not-allowed' : 'pointer',
                opacity: page === 0 ? '0.6' : '1',
                fontWeight: 'bold',
              }}
            >
              Previous
            </button>
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Page {page + 1}</span>
            <button
              onClick={handleNext}
              style={{
                padding: '10px 20px',
                backgroundColor: '#000',
                color: '#F9D342',
                border: 'none',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <NoteModal
        isOpen={noteModal.isOpen}
        transaction={noteModal.transaction}
        onClose={closeNoteModal}
        onSave={handleSaveNote}
      />

      <PumpTransactionsModal
        show={showPumpModal}
        onClose={closePumpModal}
        onSuccess={() => fetchTransactions(page)}
      />

      <GenerateStatisticsModal show={showStatisticsModal} onClose={closeStatisticsModal} />
    </div>
  );
}

export default Home;
