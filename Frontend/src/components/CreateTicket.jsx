import axios from "axios";
import React, { useState } from "react";

const CreateTicket = () => {
  const [formData, setFormData] = useState({
    Issue_Type: "default",
    description: "",
    organization_name: "",
    uploadedImage: null,
    uploadedFile: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "uploadedImage" || name === "uploadedFile") {
      // Handle file input separately
      const file = files[0];
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: file, // Store the file object
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      formData.Issue_Type === "default" ||
      formData.description.trim() === ""
    ) {
      alert("Please fill out all fields and upload both files.");
      return;
    }

    const formPayload = new FormData();
    formPayload.append("Issue_Type", formData.Issue_Type);
    formPayload.append("description", formData.description);
    formPayload.append("organization_name", formData.organization_name);
    formPayload.append("image", formData.uploadedImage); // Match backend's "image" key
    formPayload.append("pdf", formData.uploadedFile); // Match backend's "pdf" key

    try {
      setIsSubmitting(true);

      const response = await axios.post(
        "http://localhost:3000/api/v1/tickets",
        formPayload,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data", // Ensure proper encoding
          },
        }
      );

      console.log("Server Response:", response.data);
      alert("Ticket created successfully!");
      setFormData({
        Issue_Type: "default",
        description: "",
        organization_name: "",
        uploadedImage: null,
        uploadedFile: null,
      });
    } catch (error) {
      console.error("Error creating ticket:", error);
      if (error.response && error.response.data) {
        alert(`Failed to create ticket: ${error.response.data.message}`);
      } else {
        alert("Failed to create ticket. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-8">
        <div className="max-w-[1640px] mx-auto bg-gray-200 bg-opacity-50 rounded-lg p-8 flex">
          <div className="w-1/3 pr-8">
            <img
              src="https://img.freepik.com/free-vector/organic-flat-customer-support-illustration_23-2148899174.jpg?w=1380&t=st=1703599026~exp=1703599626~hmac=73f223ce6fcbfe2db7282b50aeb152b046702091d447294f52a731f70e4ba1cf"
              alt="People asking questions"
              className="w-full h-auto object-cover rounded-lg"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-blue-500 font-extrabold text-4xl mb-8 border-b-4 border-blue-500 pb-4">
              Create a New Ticket
            </h2>
            <form onSubmit={handleSubmit} className="flex flex-col">
              <label className="mb-4">
                Organization Name:
                <input
                  type="text"
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              </label>
              <label className="mb-4">
                Issue Type:
                <select
                  name="Issue_Type"
                  value={formData.Issue_Type}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
                >
                  <option value="default">Select Issue Type</option>
                  <option value="network and vpn issue">
                    Network and VPN Issue
                  </option>
                  <option value="user access and security issue">
                    User Access and Security Issue
                  </option>
                  <option value="functionality issue">
                    Functionality Issue
                  </option>
                  <option value="other issues">Other Issues</option>
                </select>
              </label>
              <label className="mb-4">
                Description:
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
                />
              </label>
              <label className="mb-4">
                Upload Image:
                <input
                  type="file"
                  name="uploadedImage"
                  accept="image/*"
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none"
                />
              </label>
              <label className="mb-4">
                Attach File:
                <input
                  type="file"
                  name="uploadedFile"
                  accept="application/pdf"
                  onChange={handleChange}
                  className="w-full p-2 border rounded-md focus:outline-none"
                />
              </label>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-500 text-white p-2 rounded-md ${
                  isSubmitting ? "opacity-50" : "hover:bg-blue-600"
                }`}
              >
                {isSubmitting ? "Submitting..." : "Create Ticket"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;












































// import axios from "axios";
// import React  , {useState} from 'react';

// const CreateTicket = () => {
//   const [formData, setFormData] = useState({
//     Issue_Type: "default",
//     description: "",
//     organization_name : "",
//     uploadedFile: null,
//     uploadedImage: null,
//   });

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (
//       formData.Issue_Type === "default" ||
//       formData.description.trim() === ""
//     ) {
//       alert("Please fill out all fields correctly.");
//       return;
//     }

//     try {

    
//       const response = await axios.post(
//         "http://localhost:3000/api/v1/tickets",
//         formData,
//         {
//           withCredentials: true,
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       );

//       console.log("Server Response:", response.data);
//       alert("Ticket created successfully!");
//       setFormData({
//         Issue_Type: "default",
//         description: "",
//         organization_name: "",
//         uploadedFile: null,
//         uploadedImage: null,
//       });
//     } catch (error) {
//       if (error.response && error.response.data) {
//         alert(`Failed to create ticket: ${error.response.data.message}`);
//       } else {
//         alert("Failed to create ticket. Please try again later.");
//       }
      
//     }
//   };
  
//   const handleChange = (e) => {
//     const { name, value ,files } = e.target;
//     if (name === "description") {   
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         [name]: value,
//       }));
//     } else if (name === "uploadImage" || name === "uploadFile") {
//       // Handle file input separately
//       const file = files[0]; // Only one file since we use maxCount: 1
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         [name]: file, // Store the file object in formData
//       }));
//     }  else {
//       setFormData((prevFormData) => ({
//         ...prevFormData,
//         [name]: value,
//         Sub_Issue_Type: "",
//       }));

//     }
//   };


// return (
//   <div className="flex min-h-screen">
//     <div className="flex-1 p-8">
//       <div
//         className={`max-w-[1640px] mx-auto bg-gray-200 bg-opacity-50 rounded-lg p-8 flex`}
//       >
//         <div className="w-1/3 pr-8">
//           <img
//             src="https://img.freepik.com/free-vector/organic-flat-customer-support-illustration_23-2148899174.jpg?w=1380&t=st=1703599026~exp=1703599626~hmac=73f223ce6fcbfe2db7282b50aeb152b046702091d447294f52a731f70e4ba1cf"
//             alt="People asking questions"
//             className="w-full h-auto object-cover rounded-lg"
//           />
//         </div>
//         <div className="flex-1">
//           <h2
//             className={`text-blue-500 font-extrabold text-4xl mb-8 border-b-4 border-blue-500 pb-4`}
//           >
//             Create a New Ticket
//           </h2>
//           <form onSubmit={handleSubmit} className="flex flex-col">
//             {/* Organization Name */}
//             <label className="mb-4">
//               Organization Name:
//               <input
//                 type="text"
//                 name="organization_name"
//                 value={formData.organization_name}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
//               />
//             </label>

//             {/* Issue Type */}
//             <label className="mb-4">
//               Issue Type:
//               <select
//                 name="Issue_Type"
//                 value={formData.Issue_Type}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
//               >
//                 <option value="default">default</option>
//                 <option value="nerwork and vpn issue">Network and VPN Issue</option>
//                 <option value="user access and security issue">User Access and Security Issue</option>
//                 <option value="functionality issue">Functionality Issue</option>
//                 <option value="other issues">Other Issues</option>
//               </select>
//             </label>

//             {/* Description */}
//             <label className="mb-4">
//               Description:
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded-md focus:outline-none focus:border-blue-500"
//               />
//             </label>

//             {/* Image Upload */}
//             <label className="mb-4">
//               Upload Image:
//               <input
//                 type="file"
//                 name="uploadedImage"
//                 accept="image/*"
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded-md focus:outline-none"
//               />
//             </label>

//             {/* File Upload */}
//             <label className="mb-4">
//               Attach File:
//               <input
//                 type="file"
//                 name="uploadedFile"
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded-md focus:outline-none"
//               />
//             </label>

//             <button
//               type="submit"
//               className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600"
//             >
//               Create Ticket
//             </button>
//           </form>
//         </div>
//       </div>
//     </div>
//   </div>
// );
// };

// export default CreateTicket;
