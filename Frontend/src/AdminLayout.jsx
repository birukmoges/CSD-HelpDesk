import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminNav from './components/AdminNav';

const AdminLayout = ({children}) =>{
    const location = useLocation();
    const showNavbar = location.pathname === '/AdminHome' || location.pathname === '/logs' || location.pathname === '/Appearance' || location.pathname === '/AssignRole';;

    return(
        <div>
            {showNavbar && <AdminNav/>}
            <div style={{ paddingBottom: '20px' }} > {children} </div>  
               
        </div>
    );
};
export default AdminLayout;