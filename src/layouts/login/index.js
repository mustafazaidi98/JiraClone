import React, { useState, useEffect } from 'react';
import {Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import './index.css';

const Login = () => {
    const history = useNavigate();
    const [username, setusername] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const handleSubmit = async (e)  => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });

            if (!response.ok) {
                throw new Error('Failed to log in');
            }
            console.error('Logged In Successfully');
            setRedirect(true);
            // Redirect to the protected page, for example
        } catch (error) {
            console.error('Failed to log in:', error);
        }
    };
    useEffect(() => {
        if (redirect) {
            history('/dashboard');
        }
    }, [redirect, history]);
    return (
        <div className="login-container">
            <h1>Login</h1>
            <form onSubmit={handleSubmit}>
                <div className="login-input">
                    <label htmlFor="username">username:</label>
                    <input
                        id="username"
                        value={username}
                        onChange={(e) => setusername(e.target.value)}
                        required
                    />
                </div>
                <div className="login-input">
                    <label htmlFor="password">Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className="login-submit">
                    <input type="submit" value="Log In" />
                </div>
            </form>
            <p>Don't have an account? <Link to="/register">Register</Link></p>

        </div>
    );
};

export default Login;