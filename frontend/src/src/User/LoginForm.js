import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css';

const LoginForm = ({ bodyClassName }) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8080/login', formData);
            const token = response.data.token; // Extract JWT token from response
            localStorage.setItem('token', token); // Store token in local storage
            const username = formData.email; // Extract username
            localStorage.setItem('username', username); // Store username in local storage
            navigate('/welcome');
        } catch (error) {
            console.error('Login failed:', error.response.data.error);
            setError(error.response.data.error); // Set error state
        }
    };
    document.body.className = bodyClassName || '';

    return (
        <div className="user-login-container">
            <a href='/' class='h3-css'>Book My Cinema</a><br /><br />

            <form onSubmit={handleSubmit} className="login-form-container">
                <h2>Login</h2>
                <div>
                    <label>Email:</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                </div>
                {error && <p className="error-message">{error}</p>}
                <button className='login-button' type="submit">Login</button><br></br>
                <p className='p-css'>Don't have an account? <a className='a-css' href="/register">Register</a></p>
            </form>
            
        </div>
    );
};

export default LoginForm;
