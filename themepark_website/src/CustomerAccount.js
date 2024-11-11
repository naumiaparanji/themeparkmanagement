import React from "react";
import './App.css';
import { apiUrl } from "./App";
import { useNavigate } from "react-router-dom";

export default class CustomerAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null,
            email: null,
            error: null,
            loggedIn: false,
        };
    }

    componentDidMount() {
        this.checkLoginStatus();
    }

    // Check if the user session is active and fetch user info
    checkLoginStatus() {
        fetch(apiUrl + '/customer/info', {
            credentials: 'include', // Ensures session cookies are sent
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                this.setState({ 
                    username: data.firstName + " " + data.lastName, 
                    email: data.email,
                    loggedIn: true 
                });
            } else {
                this.setState({ 
                    error: 'You are not logged in.',
                    loggedIn: false 
                });
            }
        })
        .catch((error) => {
            console.error('Error fetching user data:', error);
            this.setState({ 
                error: 'Unable to fetch user details.' 
            });
        });
    }

    handleLogout = () => {
        fetch(apiUrl + '/customer/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ user: this.state.username }), // Username from state
            credentials: 'include', // Include session cookies for logout
        })
        .then((response) => response.json())
        .then((data) => {
            if (data.success) {
                localStorage.removeItem('authToken');
                this.setState({ loggedIn: false, username: null, email: null });
                window.location.pathname = '/login';
            } else {
                console.error('Logout failed:', data.error);
                this.setState({ error: 'Logout failed. Please try again.' });
            }
        })
        .catch((error) => {
            console.error('Error during logout:', error);
            this.setState({ error: 'An error occurred while logging out.' });
        });
    };

    render() {
        const { loggedIn, username, error } = this.state;

        return (
            <div className="customer-account">
                {error && <p className="error-message">{error}</p>}
                
                {loggedIn ? (
                    <div>
                        <p>Welcome, {username}!</p>
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
