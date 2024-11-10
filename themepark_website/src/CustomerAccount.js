import React from "react";
import './App.css';
import { apiUrl } from "./App";
import { useNavigate } from "react-router-dom"; // Use useNavigate for redirection

export default class CustomerAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null, 
            email: null, // To store the user's email for logout
            error: null,
            loggedIn: false, // Track if the user is logged in
        };
    }

    componentDidMount() {
        this.checkLoginStatus();  // Check if user is logged in first
        this.GetUsername();  // Then fetch the username if logged in
    }

    // Check if the user is logged in by checking for authToken
    checkLoginStatus() {
        const token = localStorage.getItem('authToken');
        if (token) {
            this.setState({ loggedIn: true });  // User is logged in
        }
    }

    // Fetch the user's username and email
    GetUsername() {
        fetch(apiUrl + '/customer/info', {
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.setState({ 
                    username: data.user.username,
                    email: data.user.email
                });
            } else {
                this.setState({ error: data.error });
            }
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
            this.setState({ error: 'Failed to fetch user data.' });
        });
    }

    // Logout function
    handleLogout = () => {
        const { email } = this.state;

        // Send the logout request
        fetch(apiUrl + '/customer/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: email }), // Send the email in the request
        })
        .then((response) => response.json())
        .then(() => {
            // Clear auth token and redirect to login page
            localStorage.removeItem('authToken');  // Clear the auth token
            this.setState({ loggedIn: false, username: null, email: null });  // Reset state
            window.location.pathname = '/login';  // Redirect to login page
        })
        .catch((error) => {
            console.error('Error during logout:', error);
        });
    }

    render() {
        const { loggedIn, username, error } = this.state;

        return (
            <div className="customer-account">
                {error ? (
                    <p>{error}</p>
                ) : loggedIn ? (
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <p style={{ marginRight: '5px', marginLeft: '-10px' }}>Welcome!</p>
                        <button onClick={this.handleLogout}>Logout</button>
                    </div>
                ) : (
                    <div>
                        <p>Log in</p>
                    </div>
                )}
            </div>
        );
    }
}
