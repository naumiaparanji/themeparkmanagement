import './Auth.css'
import React, { useState } from 'react';
import MainLogo from '../images/flagslogo.png';
import { RandomBGImg, MessageBox, InputField, FancyButton, defaultButtonStyle } from './AuthComponents';
import { apiPost } from '../CRUDApi';

export function LoginBox(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const loginSubmit = async () => {
        const response = await apiPost(props.apiPath || '/customer/login',
            {
                username: email,
                password: password
            }
        ).catch((error) => console.log(error));
        if (!response) {
            setMessage('Failed to connect to server');
        } else if (response.code === 500) {
            setMessage('Server error');
        } else if (!response.body) {
            setMessage('Unknown error');
        } else if (!response.body.success) {
            setMessage('Invalid email/password');
        } else {
            window.location.pathname = props.redirect;
        }
    }

    return (
        <div className='loginbox'>
            <a href="/">
                <img src={MainLogo} alt="Main Logo" />
            </a>
            <div style={{
                fontSize: "20px",
                margin: "-18px 0px 14px 0px"
            }}>{props.title}</div>
            <hr style={{
                color: "lightgrey",
                margin:"0px 8px 16px 8px"
            }} />
            <MessageBox message={message} />
            <InputField 
                name="Email" 
                containerStyle={{margin: "0px 12px"}} 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
            />
            <InputField 
                name="Password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
            />
            <FancyButton text='Login' action={loginSubmit} />
            <FancyButton text='Register' 
                action={() => window.location.pathname = props.signUp} 
                style={Object.assign({}, defaultButtonStyle, {
                    backgroundColor: "#55ACEE",
                })}
            />
            <FancyButton text="Forgot password?" 
                action={() => window.location.pathname = "/"} 
                style={Object.assign({}, defaultButtonStyle, {
                    color: "blue",
                    backgroundColor: "white",
                    padding: "2px 0px",
                    width: "auto"
                })}
            />
        </div>
    );
}

export function Login(props) {
    return (
    <div className='container'>
        <RandomBGImg />
        <LoginBox 
            title={props.title || 'Customer Portal'}
            redirect={props.redirect || '/'} 
            signUp={props.signUp || '/signup'}
            apiPath={props.apiPath}
        /> { /* To be replaced with customer view path */}
    </div>
    );
};

export function EmployeeLogin(props) {
    return (
        <Login
            title={props.title || 'Employee Portal'}
            redirect={props.redirect || '/employee/access'} 
            signUp={props.signUp || '/employee/signup'}
            apiPath={props.apiPath || '/employee/login'}
        />
    );
}
