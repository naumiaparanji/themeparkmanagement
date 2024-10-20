import React from "react";
import './App.css';
import { apiUrl } from "./App";

// Might be a better way to do this idk
// Example element that changes text to user account name on successful info fetch
export default class CustomerAccount extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            username: null, 
            error: null
        };
    }

    componentDidMount() {
        this.GetUsername();
    }

    GetUsername() {
        fetch(apiUrl + '/customer/info', {
            credentials: 'include',
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) this.setState({username: data.user});
            else this.setState({error: data.error});
        });
        
    }

    render() {
        return (this.state.username || this.props.text);
    }
}
