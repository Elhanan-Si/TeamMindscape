import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/Login.css";
import { authLogin } from '../services/api';
import { toast } from 'react-toastify';

const Login = ({ setIsLoggedIn  }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateInputs = () => {
        if (email.length === 0 || !email.includes("@")) {
            toast.error("Please enter a valid email")
            return false;
        } 
        if (password.length === 0) {
            toast.error("Please enter a valid password")
            return false;
        }
        return true;
    }
  
    const handleLogin = async (e) => {
        e.preventDefault();

        if (validateInputs()) {
            setLoading(true);
            
            const response = await authLogin({ email, password });
            if (response.error) {
                setLoading(false);
                toast.error(response.message)
                
            } else {
                setLoading(false);
                setIsLoggedIn(true);
                toast.success('Login successful!');
                navigate('/tasks');
            }
        }
    };

    return (
        <div className="login-container">
            <h2 className="login-heading">Login</h2>
            <form onSubmit={handleLogin} className="login-form">
                <div className="form-group">
                    <label>Email:</label>
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Password:</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <a href="/forgotPassword">Forgot password?</a>
                <button type="submit" className="login-button" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </div>
    );
};

export default Login;
