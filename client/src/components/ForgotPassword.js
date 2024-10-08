import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { sendVerificationCode } from '../services/api';
import { toast } from 'react-toastify';
import '../styles/Forget&ResetPass.css';


const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        const response = await sendVerificationCode(email);
        setLoading(false);

        if (response.error) {
            toast.error(response.message);
        } else {
            toast.success(response.message);
            navigate('/resetPassword', { state: { email }});
        }
    };

    return (
        <div className="auth-container">
            <h2 className="auth-heading">Forgot Password</h2>
            <form onSubmit={handleSendCode} className="auth-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="auth-button" disabled={loading}>
                    {loading ? "Sending..." : "Send Verification Code"}
                </button>
            </form>
        </div>
    )
}

export default ForgotPassword;
