import './Auth.css'
import { apiUrl } from '../App';
import React, { useState } from 'react';
import MainLogo from '../images/flagslogo.png';
import { RandomBGImg, MessageBox, InputField, FancyButton, Validation, defaultButtonStyle } from './AuthComponents';

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
        try {
            const response = await fetch(apiUrl + '/customer/register', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: email, 
                    password: password
                }),
            });
            const data = await response.json();
            if (data.success) {
                window.location.pathname = props.redirect;
            } else {
                if (response.status === 409) setMessage('An account with this email already exists');
                else setMessage('Sign-up failed');
            }
        } catch (error) {
            console.log(error);
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
