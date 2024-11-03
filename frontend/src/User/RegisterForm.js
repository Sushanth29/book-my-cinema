import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './RegisterForm.css';

const RegisterForm = ({ bodyClassName }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+|\-=\[\]{};':"\\,.<>\/?])(?=.{8,})/;
        return passwordRegex.test(password);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password!==formData.confirmPassword){
            alert('Passwords do not match');
            return
        }

     
        if (!validatePassword(formData.password)) {
            console.error('Password does not meet requirements');
            alert('Password must have a minimum of 8 characters, at least 1 capital letter, and at least 1 special character.');
            return;
        }

        const {confirmPassword, ...formData2} = formData

        try {
            const response = await axios.post('http://13.53.132.117:8080/register', formData2);
            console.log('Response:', response.data);
            alert('Successfully registered');
            navigate('/login');
        } catch (error) {
            alert(error.response.data.error);
            console.error('Registration failed:', error.response.data.error);
        }
    };

    document.body.className = bodyClassName || '';

    return (
        <div className="register-container">
            <a href='/' className='h3-css'>Book My Cinema</a><br /><br />

            <div className="register-form-container">
                <h2>Register</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Username:</label>
                        <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Password:</label>
                        <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div>
                        <label>Confirm Password:</label>
                        <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>
                    <button className='reg-btn' type="submit">Register</button>
                </form>
                <p className='p-css'>Already have an account? <a className='a-css' href="/login">Login</a></p>
            </div>
        </div>
    );
};

export default RegisterForm;
