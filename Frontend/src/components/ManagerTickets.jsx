// TicketList.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TicketDetailsModal from './TicketDetailsModal';

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Popup visibility 
  const [selectedRow, setSelectedRow] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const totalPages = Math.ceil(tickets.length / itemsPerPage);

  const popupStyle = { 
    position: "fixed", 
    top: 0, 
    left: 0, 
    width: "100%", 
    height: "100%", 
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    display: "flex", 
    justifyContent: "center", 
    alignItems: "center", 
}; 
 
  const popupContentStyle = { 
    backgroundColor: "white", 
    padding: "20px", 
    borderRadius: "8px", 
    width: "300px", 
    textAlign: "center", 
}; 
 
const closeButtonStyle = { 
    marginTop: "10px", 
    padding: "10px 16px", 
    backgroundColor: "#f44336", // Red background 
    color: "#fff", // White text 
    border: "none", 
    borderRadius: "4px", 
    cursor: "pointer", 
};


  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/v1/reports/tickets', { withCredentials: true });
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error);
      }
    };

    fetchTickets();
  }, []);
/// handel row click 
  const handleRowClick = (ticket) => { 
    setSelectedRow(ticket); // Set the selected ticket data 
    setIsPopupOpen(true); // Open the popup 
  
}; 
 
// Handle popup close 
const handleDescriptionPopup = () => { 
    setIsPopupOpen(false); // Close the popup 
    setSelectedRow(null); // Clear the selected ticket 
}; 


// Calculate current page tickets
const indexOfLastItem = currentPage * itemsPerPage;
const indexOfFirstItem = indexOfLastItem - itemsPerPage;
const currentTickets = tickets.slice(indexOfFirstItem, indexOfLastItem);

// Handle page change
const handleNextPage = () => {
  if (currentPage < totalPages) setCurrentPage(currentPage + 1);
};

const handlePrevPage = () => {
  if (currentPage > 1) setCurrentPage(currentPage - 1);
};



  const formatString = (str) => {
    if (str.length <= 6) {
        return str; // If the string is too short, return it as-is
    }
  
    const firstThree = str.slice(0, 3); // First 3 characters
    const lastThree = str.slice(-3); // Last 3 characters
    return `${firstThree} ... ${lastThree}`;
  };

  const handleGenerateReport = async (ticketId, agentId) => {
    try {
      const response = await axios.get(`http://localhost:3000/api/v1/reports/tickets/ticketsId/${ticketId}`, { withCredentials: true });
      setSelectedTicket(response.data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching ticket details:', error);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', textAlign: 'center', paddingTop: '20px' }}>
      <h1 style={{ color: '#333' }}>Ticket List</h1>
      <table
        style={{
          borderCollapse: 'collapse',
          width: '80%',
          margin: 'auto',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2', borderBottom: '2px solid #ddd', color: '#333' }}>
            <th style={{ padding: '12px' }}>Ticket ID</th>
            <th style={{ padding: '12px' }}>Assigned Agent ID</th>
            <th style={{ padding: '12px' }}>Ticket Owner</th>
            <th style={{ padding: '12px' }}>Issue Type</th>
            <th style={{ padding: '12px' }}>Generate Report</th>
          </tr>
        </thead>
        <tbody>
          {currentTickets.map((ticket) => (
            <tr key={ticket._id}
             style={{ borderBottom: '1px solid #ddd' } }
             onClick={() => handleRowClick(ticket)}
             >
              <td style={{ padding: '12px' }}>{formatString(ticket._id)}</td>
              <td style={{ padding: '12px' }}>{ticket.Assigned_AgentName}</td>
              <td style={{ padding: '12px' }}>{ticket.Orgaization_Name}</td>
              <td style={{ padding: '12px' }}>{ticket.Issue_Type}</td>
              <td style={{ padding: '12px' }}>
                <button
                  style={{
                    background: '#4caf50',
                    color: 'white',
                    border: 'none',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    cursor: 'pointer'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleGenerateReport(ticket._id, ticket.Assigned_AgentID);}
                  }
                >
                  Generate Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>


      {/* Pagination Controls */}
      <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
        <button
          onClick={handlePrevPage}
          disabled={currentPage === 1}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: currentPage === 1 ? "#f0f0f0" : "#fff",
            cursor: currentPage === 1 ? "not-allowed" : "pointer"
          }}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          style={{
            padding: "8px 16px",
            borderRadius: "4px",
            border: "1px solid #ccc",
            backgroundColor: currentPage === totalPages ? "#f0f0f0" : "#fff",
            cursor: currentPage === totalPages ? "not-allowed" : "pointer"
          }}
        >
          Next
        </button>
      </div>

      {isPopupOpen && selectedRow && ( 
        <div style={popupStyle}> 
            <div style={popupContentStyle}> 
                <h2> <strong>Ticket Details </strong> </h2> 
                <p> 
                    <strong>Issue Type:</strong> {selectedRow.Issue_Type} 
                </p> 
                <p> 
                    <strong>Description:</strong> {selectedRow.Description} 
                </p> 
                <p> 
                    <strong>Ticket Owner:</strong> {selectedRow.Orgaization_Name} 
                </p> 
                <button onClick={handleDescriptionPopup} style={closeButtonStyle}> 
                    Close 
                </button> 
            </div> 
        </div> )}

      <TicketDetailsModal isOpen={isModalOpen} onClose={handleCloseModal} ticket={selectedTicket} />
    </div>
  );
};

export default TicketList;
