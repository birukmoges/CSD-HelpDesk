import React from "react";

const ContactUs = () => {
  return (
    <div className="flex flex-col items-center bg-gray-100 py-12 px-4">
    <h2 className="text-3xl font-bold text-center mb-4">How can we help you?</h2>
    <p className="text-center text-gray-700 max-w-2xl mb-8">
      If you need assistance, the CSD Help Desk is here for you. Contact us via
      the following channels for support and inquiries.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl">
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
        <span className="text-purple-600 text-3xl">📍</span>
        <h3 className="font-semibold mt-2">OUR MAIN OFFICE</h3>
        <a className="text-gray-600 text-center hover:hover:text-black hover:font-bold transition duration-200" href="https://maps.app.goo.gl/mb6PpVC9eo6KBzpP8" 
        target="_blank"
        >
          Sudan Street
        </a>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
        <span className="text-purple-600 text-3xl">📞</span>
        <h3 className="font-semibold mt-2">PHONE NUMBER</h3>
        <p className="text-gray-600 text-center">6230</p>
        <p className="text-gray-500 text-sm">800-123-4567 (Toll Free)</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
        <span className="text-purple-600 text-3xl">📠</span>
        <h3 className="font-semibold mt-2">FAX</h3>
        <p className="text-gray-600 text-center">1-234-567-8900</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center">
        <span className="text-purple-600 text-3xl">✉️</span>
        <h3 className="font-semibold mt-2">EMAIL</h3>
        <p className="text-gray-600 text-center">support@csdhelpdesk.com</p>
      </div>
    </div>
  </div>
  );
};

export default ContactUs;
