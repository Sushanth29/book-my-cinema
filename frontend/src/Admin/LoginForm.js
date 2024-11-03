import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './loginStyles.css';

const AdminLoginForm = ({bodyClassName}) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://13.53.132.117:8080/admin-login', formData);
            const token = response.data.token; // Extract JWT token from response
            localStorage.setItem('token', token); // Store token in local storage
            const username = formData.email; // Extract username
            localStorage.setItem('username', username); // Store username in local storage
           console.log(response)
            navigate('/welcome-admin');
        } catch (error) {
            console.error('Login failed:', error.response.data.error);
        }
    };
    document.body.className = bodyClassName || ''

    return (
        <div className="register-container">
           <a href='/' class='h3-css'>Book My Cinema</a>
<br></br><br></br>
            <div className="form-container">
                <h2>Admin Login</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <button type="submit">Login</button>
                </form>
            </div>
        </div>
    );
};

export default AdminLoginForm;
