import React, { useState } from 'react';
import { updateUser } from '../services/api';
import { toast } from 'react-toastify';


const FormUpdateUser = ({ user, isManager, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        firstname: user.firstname,
        lastname: user.lastname,
        job: user.job,
        email: user.email,
        phone: user.phone,
        permission: user.permissionLevel
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await updateUser(user._id, formData);
        if (response.error) {
            toast.error(response.message);
        } else {
            // handle success
            toast.success(response.message);
            onSuccess(response.data);
            onClose();
        }
    }

    return (
        <div className="user-update-form">
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>First Name</label>
                    <input
                        type="text"
                        name="firstname"
                        value={formData.firstname}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Last Name</label>
                    <input
                        type="text"
                        name="lastname"
                        value={formData.lastname}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Job</label>
                    <input
                        type="text"
                        name="job"
                        value={formData.job}
                        onChange={handleChange}
                        disabled={!isManager}
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        disabled={!isManager}
                    />
                </div>
                <div className="form-group">
                    <label>Phone</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Permission</label>
                    <select
                        name="permission"
                        value={formData.permission}
                        onChange={handleChange}
                        disabled={!isManager}
                    >
                        <option value="Worker">Worker</option>
                        <option value="Manager">Manager</option>
                    </select>
                </div>
                <button type="submit">Update User</button>
                <button type="button" onClick={onClose}>Cancel</button>
            </form>
        </div>
    )
};

export default FormUpdateUser;