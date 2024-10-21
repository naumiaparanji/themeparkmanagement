import './Auth.css'
import React, { useState } from 'react';
import MainLogo from '../images/flagslogo.png';
import { RandomBGImg, MessageBox, InputField, FancyButton, Validation, defaultButtonStyle } from './AuthComponents';
import { apiPost } from '../CRUDApi';

export function SignUpBox(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const signUpSubmit = async () => {
        const inputCheck = Validation({email: email, password: password});
        if (inputCheck.email) {
            setMessage(inputCheck.email);
            return;
        }
        if (inputCheck.password) {
            setMessage(inputCheck.password);
            return;
        }
        if (password !== confirmPassword) {
            setMessage('Passwords do not match');
            return;
        }
        const response = await apiPost('/customer/register', 
            {
                username: email,
                password: password
            }
        ).catch((error) => console.log(error));
        if (!response) {
            setMessage('Failed to connect to server');
        } else if (response.code === 500) {
            setMessage('Server error');
        } else if (response.code === 409) {
            setMessage('An account with this email already exists');
        } else if (!response.body) {
            setMessage('Unknown error');
        } else if (!response.body.success) {
            setMessage('Sign-up failed');
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
            }}>Customer Sign-Up</div>
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
            <InputField 
                name="Confirm Password" 
                type="password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FancyButton text='Sign Up' action={signUpSubmit} />
            <div><p>Already have an account?</p></div>
            <FancyButton text='Login' 
                action={() => window.location.pathname = "/login"} 
                style={Object.assign({}, defaultButtonStyle, {
                    backgroundColor: "#55ACEE",
                })}
            />
        </div>
    );
}

export function SignUp() {
    return (
    <div className='container'>
        <RandomBGImg />
        <SignUpBox redirect="/login" />
    </div>
    );
};
