import React from 'react';
import { LightOceanTheme } from './themes'; 

const Homepage = () => {
  const theme = LightOceanTheme;

  const backgroundStyle = {
    backgroundImage: "url('https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: '100vh', 
    position: 'relative',
  };

  const overlayStyle = {
    position: 'absolute',
    top: '50%', 
    left: '50%',
    transform: 'translate(-50%, -50%)', // Center the content
    backgroundColor: `rgba(255, 255, 255, 0.9)`, 
    padding: '20px',
    borderRadius: '8px', // Optional: Adds rounded corners to the content
    backdropFilter: 'blur(10px)', // This will add a blurred effect to the background for better visibility of text
  };

  const contentStyle = {
    color: theme.colors.text, 
    textAlign: 'center',
  };
  const navbarStyle = {
    backgroundColor: "whitesmoke", // Change navbar background to white
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    width: '100%',
    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)', // Optional: Subtle shadow for depth
    zIndex: 1000, // Ensure it stays on top
  };

  return (
    <div style={backgroundStyle}>
      <div style={overlayStyle}>
        <div style={contentStyle}>
          <h1 style={{ fontSize: '3rem', marginBottom: '20px' }}><span className='font-bold'>Welcome To CSD Help Desk</span></h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '20px' }}>
           CSD Help Desk is your ultimate solution for all your queries and issues.
          </p>
          <p style={{ fontSize: '1rem' }}>
            "Empowering Support, One Ticket at a Time."
          </p>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
