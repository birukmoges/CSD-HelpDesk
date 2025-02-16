// MainLayout.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer'

const MainLayout = ({ children }) => {
  const location = useLocation();
  const showNavbar = location.pathname === '/' || location.pathname === '/login';

  return (
    <div>
      {showNavbar && <Navbar /> }
      <div> {children} </div>  
      <Footer userType = "home"/>
    </div>
  );
};

export default MainLayout;