import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { isAuthenticated } from './services/api';
import { ToastContainer } from 'react-toastify';
import Login from './components/Login';
import Layout from './pages/Layout';
import AppRoutes from './services/AppRoutes';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import 'react-toastify/dist/ReactToastify.css';


const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            const result = await isAuthenticated();
            setIsLoggedIn(result.authenticated);
            setLoading(false);
        };

        checkAuth();
    }, []);

    if (loading) {
        return <div>Loading...</div>
    }

    return (
        <div>
            <ToastContainer />
            <Router>
                <Routes>
                    <Route path='/login' element={<Login setIsLoggedIn={setIsLoggedIn} />} />
                    <Route path="/forgotPassword" element={<ForgotPassword />} />
                    <Route path="/resetPassword" element={<ResetPassword />} />
                    {isLoggedIn && (
                        <Route path='/*' element={<Layout />}>
                            <Route path="*" element={<AppRoutes />} />
                        </Route>
                    )}
                    <Route path='*' element={!isLoggedIn && <Navigate to="/login" replace />} />
                </Routes>
            </Router>
        </div>
    );
};

export default App;
