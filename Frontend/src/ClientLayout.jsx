// ClientLayout.js
import React from "react";
import { useLocation } from "react-router-dom";
import ClientNav from "./components/ClientNav";
import Footer from './components/Footer';

const ClientLayout = ({ children }) => {
  const location = useLocation();
  const showNavbar =
    location.pathname === "/ClientHome" ||
    location.pathname === "/KnowledgeBase" ||
    location.pathname === "/ViewMyTickets" ||
    location.pathname === "/CreateTicket"||
    location.pathname === "/AboutUs"||
    location.pathname === "/Contact";


  return (
    <div>
      {showNavbar && <ClientNav />}
      <div> {children} </div>  
      <Footer 
        userType = "client"
      />
    </div>
  );
};

export default ClientLayout;
