import React, { useState, useEffect } from "react";
import '../styles/FormAddUser.css';
import { createUser } from '../services/api';
import { toast } from 'react-toastify';

const FormAddUser = () => {
    const [inputs, setInputs] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setInputs(values => ({
            ...values,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        const response = await createUser(inputs)
        if (response.error) {
            toast.error(response.message);
            setLoading(false);
        } else {
            toast.success(response.message);
            setLoading(false);
        }
    }

    const randomPassword = () => {
        const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz!@#$%^&*()_+";
        let randomString = '';
        for (let i = 0; i < 8; i++) {
            const randomNumber = Math.floor(Math.random() * chars.length);
            randomString += chars[randomNumber];
        }
        setInputs(values => ({ ...values, password: randomString }));
    };

    useEffect(() => {
        randomPassword();
    }, []);

    return (
        <div className="form-container">
            <h1>{'Add Employee'}</h1>
            <form onSubmit={handleSubmit} className="form">   
                <div className="form-section"> {/* עמודה 1 */}
                    <div className="form-group">
                        <label>Firstname</label>
                        <input 
                            type="text" 
                            name="firstname" 
                            value={inputs.firstname} 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Lastname</label>
                        <input 
                            type="text" 
                            name="lastname" 
                            value={inputs.lastname} 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Job</label>
                        <input 
                            type="text" 
                            name="job" 
                            value={inputs.job} 
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-section"> {/* עמודה 2 */}
                    <div className="form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email" 
                            value={inputs.email} 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input 
                            type="password" 
                            name="password" 
                            value={inputs.password} 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Phone</label>
                        <input 
                            type="text" 
                            name="phone" 
                            value={inputs.phone} 
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="form-section"> {/* עמודה 3 */}
                    <div className="form-group">
                        <label>Department</label>
                        <input 
                            type="text" 
                            name="department" 
                            value={inputs.department} 
                            onChange={handleChange}
                        />
                    </div>
                    <div className="form-group">
                        <label>Manager</label>
                        <input 
                            type="checkbox" 
                            name="permission" 
                            checked={inputs.permission} 
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? "Saving..." : "Add User" }
                </button>
            </form>
        </div>
    );
    
};

export default FormAddUser;
