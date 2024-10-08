import React, { useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import { resetPassword } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/Forget&ResetPass.css';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [verificationCode, setVerificationCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const email = location.state?.email;

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await resetPassword({ email, verificationCode, newPassword });
        setLoading(false);

        if (response.error) {
            toast.error(response.message);
        } else {
            toast.success(response.message);
            navigate('/login');
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-heading">Reset Password</h2>
            <form onSubmit={handleResetPassword} className="auth-form">
                <div className="form-group">
                    <label>Verification Code:</label>
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>New Password:</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? "Resetting..." : "Reset Password"}
                </button>
            </form>
        </div>
    )
}

export default ResetPassword;
