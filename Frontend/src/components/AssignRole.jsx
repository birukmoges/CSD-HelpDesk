import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import RoleUpdatePopup from './RoleUpdatePopup';
import AppearanceContext from '../AppearanceContext';
import {
  LightOceanTheme,
  DarkNebulaTheme,
  EarthyForestTheme,
  SunsetGlowTheme,
  LavenderMistTheme,
  CloudySkyTheme,
} from './themes';

const themes = {
  Light: LightOceanTheme,
  Dark: DarkNebulaTheme,
  Forest: EarthyForestTheme,
  Sunset: SunsetGlowTheme,
  Lavender: LavenderMistTheme,
  Cloudy: CloudySkyTheme,
};

const AssignRole = () => {
  const {
    themeName: contextThemeName,
    setThemeName,
  } = useContext(AppearanceContext);

  const [themeName, setLocalThemeName] = useState(contextThemeName);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [Category, setCategory] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };



  useEffect(() => {
    fetchGlobalSettings();
    getUsers();
  }, []);
  const getUsers = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/v1/admin/getUsers', { withCredentials: true });
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const roleNames = {
    2: 'Manager',
    3: 'Support Agent',
    4: 'Client'
  };
  const getRoleName = (roleId) => {
    return roleNames[roleId] || 'Unknown';
  };
  const handleRoleChange = async () => {
    try {
      const response = await axios.post('http://localhost:3000/api/v1/admin/assignRole', {
        userID: selectedUser._id,
        roleID: 3 ,
        Category : Category
      }, { withCredentials: true });

      if (response.data) {
        console.log('Role updated successfully');
        alert('Role updated successfully!');
      } else {
        console.error('Failed to update user role:', response.data.message);
        alert('Failed to update user role');
      }

      getUsers();
      setShowPopup(false);
    } catch (error) {
      console.error('Error updating user role:', error);
    }
  };

  const handleSearch = () => {
    const filtered = users.filter((user) => user.Username.toLowerCase().includes(searchTerm.toLowerCase()));
    setFilteredUsers(filtered);
  };

  const resetSearch = () => {
    setSearchTerm('');
    setFilteredUsers(users);
  };

  const fetchGlobalSettings = async () => {
    try {
      const globalSettingsResponse = await axios.get('http://localhost:3000/Appearance/', {
        withCredentials: true,
      });
      if (globalSettingsResponse.data.uniqueThemes.length > 0) {
        setLocalThemeName(globalSettingsResponse.data.uniqueThemes[0]);
        setThemeName(globalSettingsResponse.data.uniqueThemes[0]);
      }
    } catch (error) {
      console.error('Error fetching global appearance settings:', error);
    }
  };

  const selectedTheme = themes[themeName];
  const workflowTableStyle = {
    backgroundColor: selectedTheme.colors.background,
    color: selectedTheme.colors.text,
  };

  const workflowButtonStyle = {
    backgroundColor: selectedTheme.colors.primary,
    color: selectedTheme.colors.background,
  };

  return (
    <div>  
       <div className="container mx-auto p-8" style={workflowTableStyle}>
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">User Management</h2>
        <input
         type='text'
         id='search'
         value={searchTerm}
         onChange={(e) => setSearchTerm(e.target.value)}
         onKeyDown={(e) => {
           if (e.key === 'Enter') {
             handleSearch();
           }
         }}
          className="border p-2 mr-2"
        />
   
        <button
          onClick={handleSearch}
          className="p-2 rounded mr-2"
          style={workflowButtonStyle}
        >
          Search
        </button>

        <button
          onClick={resetSearch}
          className="p-2 rounded"
          style={workflowButtonStyle}
        >
          reset
        </button>
      </div>

      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold">email</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold">username</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold">phone number</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold">role</th>
            <th className="px-6 py-3 border-b-2 border-gray-300 text-left text-sm font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>

        {currentUsers.map((user) => (
            <tr key={user._id}>
              <td className="px-6 py-4">{user.Email}</td>
              <td className="px-6 py-4">{user.Username}</td>
              <td className="px-6 py-4">{user.PhoneNumber}</td>
              <td className="px-6 py-4">{getRoleName(user.RoleID)}</td>
              <td className="px-6 py-4">
              <button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowPopup(true);
                  }}
                  className="hover:text-red-700"
                  style={workflowButtonStyle}                >
                  Make Agent
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-2 rounded"
            style={workflowButtonStyle}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded"
            style={workflowButtonStyle}
          >
            Next
          </button>
        </div>
      
      {showPopup && (
        <RoleUpdatePopup
          Category={Category}
          onUpdate={(value) => setCategory(value)}
          onClose={() => setShowPopup(false)}
          onRoleChange={handleRoleChange}
          style={{ backgroundColor: selectedTheme.popupBackgroundColor }}
        />
      )}
    </div>
















       {/* <div style={{ textAlign: 'center', padding: '20px', backgroundColor: selectedTheme.backgroundColor }}>
      <h1 style={{ color: selectedTheme.textColor }}>User Management</h1>
      <div style={{ marginBottom: '20px' }}>
        <label htmlFor='search' style={{ marginRight: '10px', color: selectedTheme.textColorSecondary }}>
          Search Username:
        </label>
        <input
          type='text'
          id='search'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleSearch();
            }
          }}
          style={{ marginRight: '10px', padding: '8px', border: `1px solid ${selectedTheme.borderColor}` }}
        />
        <button onClick={handleSearch} style={{ marginRight: '10px', padding: '8px', backgroundColor: selectedTheme.buttonColor, color: selectedTheme.buttonTextColor, border: `1px solid ${selectedTheme.buttonBorderColor}` }}>
          Search
        </button>
        <button onClick={resetSearch} style={{ padding: '8px', backgroundColor: selectedTheme.buttonSecondaryColor, color: selectedTheme.buttonSecondaryTextColor, border: `1px solid ${selectedTheme.buttonSecondaryBorderColor}` }}>
          Reset
        </button>
      </div>
      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={tableHeaderStyles}>Email</th>
            <th style={tableHeaderStyles}>Username</th>
            <th style={tableHeaderStyles}>Phone Number</th>
            <th style={tableHeaderStyles}>Role</th>
            <th style={tableHeaderStyles}>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map((user) => (
            <tr key={user._id}>
              <td style={tableCellStyles}>{user.Email}</td>
              <td style={tableCellStyles}>{user.Username}</td>
              <td style={tableCellStyles}>{user.PhoneNumber}</td>
              <td style={tableCellStyles}>{getRoleName(user.RoleID)}</td>
              <td style={tableCellStyles}>
                <button
                  onClick={() => {
                    setSelectedUser(user);
                    setShowPopup(true);
                  }}
                  style={{ backgroundColor: selectedTheme.actionButtonColor, color: selectedTheme.actionButtonTextColor, padding: '8px', border: `1px solid ${selectedTheme.actionButtonBorderColor}` }}
                >
                  Make Agent
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showPopup && (
        <RoleUpdatePopup
          Category={Category}
          onUpdate={(value) => setCategory(value)}
          onClose={() => setShowPopup(false)}
          onRoleChange={handleRoleChange}
          style={{ backgroundColor: selectedTheme.popupBackgroundColor }}
        />
      )}
    </div> */}
    </div>
   
  );
};

const tableStyles = {
  borderCollapse: 'collapse',
  width: '80%',
  margin: 'auto'
};

const tableHeaderStyles = {
  border: '1px solid black',
  padding: '8px'
};

const tableCellStyles = {
  border: '1px solid black',
  padding: '8px'
};

export default AssignRole;
