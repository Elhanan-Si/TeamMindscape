import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import '../styles/Layout.css'

import userIconProfile from '../assets/icons/user-icon.png'
import NavBar from '../components/NavBar';
import Profile from '../components/Profile';


const Layout = () => {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const toggleProfile = () => {
        setIsProfileOpen(!isProfileOpen);
    };

    const closeProfile = () => {
        setIsProfileOpen(false);
    };

    return (
        <div className='layout-container'>
            <NavBar />
            <div className='main-content'>
                <div className='profile-icon-container' onClick={toggleProfile}>
                    <img className='profile-icon' src={userIconProfile} alt='Profile-icon'/>
                </div>
                {isProfileOpen && (
                    <div className='profile-popup'>
                        <Profile onClose={closeProfile}/>
                    </div>
                )}
                <div className='content'>
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
