import React from "react";

const AboutUs = () => {
  return (
    <div className="relative w-full min-h-screen bg-gray-100">
      {/* Hero Section */}
      <div className="relative w-full h-[60vh] bg-cover bg-center" 
        style={{ backgroundImage: "url('/path-to-your-image.jpg')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center p-6">
          <h1 className="text-4xl md:text-5xl font-bold">About Us</h1>
          <p className="mt-3 text-lg max-w-2xl">
            Welcome to the CSD Help Desk, your trusted support system for all inquiries and security depository concerns.
          </p>
        </div>
      </div>

      {/* About Us Content */}
      <div className="max-w-5xl mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-3xl font-bold text-gray-800 text-center">Who We Are</h2>
        <p className="text-gray-600 mt-4 text-center">
          The **Central Securities Depository (CSD) Help Desk** is dedicated to assisting users with financial transactions, securities processing, 
          and investment management. Our team ensures a seamless experience by providing quick support, secure access, and expert guidance.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-8">Our Mission</h3>
        <p className="text-gray-600 mt-2">
          We aim to enhance efficiency in financial markets by offering secure, transparent, and accessible depository solutions. 
          Our help desk provides instant resolution to your queries, ensuring smooth operations.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-8">What We Offer</h3>
        <ul className="mt-4 list-disc list-inside text-gray-600">
          <li>Fast and reliable customer support</li>
          <li>Guidance on CSD transactions and processes</li>
          <li>Secure account management</li>
          <li>Technical assistance for system-related issues</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
