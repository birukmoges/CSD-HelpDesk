import React from "react";
import { useNavigate } from "react-router-dom";

const Footer = ({ userType }) => {
  const navigate = useNavigate();
  console.log(`the user type printing out  ${userType}`)
  return (
    <footer style={footerStyles}>
      <div style={containerStyles}>
        <p style={{ margin: 0 }}>
          © {new Date().getFullYear()} CSD Help Desk. All rights reserved.
        </p>
        {userType === "client" ? (
          
          <nav style={navStyles}>
            <button
              onClick={() => navigate("/Contact")}
              className="text-gray-600 hover:text-black hover:underline cursor-pointer border-none outline-none focus:ring-0"
            >
              Contact
            </button>
            <span style={dividerStyles}>|</span>

            <button
              onClick={() => navigate("/AboutUs")}
              className="text-gray-600 hover:text-black hover:underline cursor-pointer border-none outline-none focus:ring-0"
            >
              About Us
            </button>
            <span style={dividerStyles}>|</span>
            <button
              onClick={() => navigate("/KnowledgeBase")}
              className="text-gray-600 hover:text-black hover:underline cursor-pointer border-none outline-none focus:ring-0"
            >
              FAQ
            </button>
          </nav>
        ) : (
          <p style={{ fontSize: "14px", color: "black", marginTop: "5px" }}>
            Welcome to CSD Help Desk.  Please contact support for assistance.
          </p>
        )}
      </div>
    </footer>
  );
};

// Inline styles for the footer
const footerStyles = {
  backgroundColor: "#whitesmoke",
  padding: "10px 20px",
  textAlign: "center",
  borderTop: "1px solid #ddd",
};

const containerStyles = {
  maxWidth: "1200px",
  margin: "0 auto",
};

const navStyles = {
  marginTop: "5px",
  fontSize: "14px",
};

const dividerStyles = {
  margin: "0 10px",
  color: "#6c757d",
};

export default Footer;
