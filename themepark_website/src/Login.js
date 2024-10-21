import './Login.css'
import { apiUrl } from './App';
import React, { useState } from 'react';
import MainLogo from './images/flagslogo.png';
import BgA from './images/login-a.jpg'
import BgB from './images/login-b.jpg'
import BgC from './images/login-c.jpg'
import BgD from './images/login-d.jpg'

const BgImgs = [BgA, BgB, BgC, BgD];

function RandomBGImg() {
    const currentImageIndex = Math.floor(Math.random() * BgImgs.length);
    return (
      <div
        id="login-bg"
        style={{ backgroundImage: `url(${BgImgs[currentImageIndex]})` }}
      ></div>
    );
  }

const defaultInputStyle = {
    boxSizing: 'border-box',
    padding: "12px",
    fontSize: "14px",
    margin: "0px",
    width: "100%",
    borderRadius: "8px", 
    border: "grey 1px solid"
};

const defaultButtonStyle = {
    backgroundColor: "#86af49",
    boxSizing: 'border-box',
    border: "none",
    padding: "10px 60px",
    color: "white",
    margin: "0px",
    borderRadius: "6px", 
    fontSize: "18px",
    cursor: "pointer",
    width: "100%"
};

const defaultMessageStyle = {
    color: "red"
}

const defaultContainerStyle = {
    margin: "12px"
};

function InputField(props) {
    return (
        <div style={props.containerStyle || defaultContainerStyle}>
            <input
              style={props.style || defaultInputStyle}
              onChange={props.onChange}
              type={props.type || 'text'}
              placeholder={props.name || ''}
              value={props.value}
            />
        </div>
    );
}

function FancyButton(props) {
    return (
        <div style={props.containerStyle || defaultContainerStyle}>
            <button 
              style={props.style || defaultButtonStyle}
              onClick={props.action}>{props.text}
            </button>
        </div>
    );
}

function MessageBox(props) {    
    return (props.message?
        <div style={props.containerStyle || defaultContainerStyle}>
            <p style={props.style || defaultMessageStyle}>
                {props.message}
            </p>
        </div>
        : (null)
    );
};

function LoginBox(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const loginSubmit = async () => {
        try {
            const response = await fetch(apiUrl + '/customer/login', {
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
                setMessage('Invalid email/password');
            }
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='loginbox'>
            <img src={MainLogo} />
            <div style={{
                fontSize: "20px",
                margin: "-18px 0px 14px 0px"
            }}>Customer Portal</div>
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
                action={() => window.location.pathname = "/register"} 
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

export function Login() {
    return (
    <div className='container'>
        <RandomBGImg />
        <LoginBox redirect="/" />
    </div>
    );
};
