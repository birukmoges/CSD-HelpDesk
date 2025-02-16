import React from 'react';
import { useLocation } from 'react-router-dom';
import ManagerNav from './components/ManagerNav';


const ManagerLayout = ({ children }) => {
  const location = useLocation();
  const showNavbar = location.pathname === '/ManagerHome'|| location.pathname === '/AgentIssuesCharts'  || location.pathname === '/AssignRole'| location.pathname === '/ManagerTickets';

  return (
    <div>
      {showNavbar && <ManagerNav />}
    <div style={{ paddingBottom: '20px' }} > {children} </div>  
    </div>
  );
};

export default ManagerLayout;
