import './Auth.css'
import React, {useState} from 'react';
import MainLogo from '../images/flagslogo.png';
import {defaultButtonStyle, FancyButton, InputField, MessageBox, RandomBGImg} from './AuthComponents';
import {api} from '../App';

export function LoginBox(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const loginSubmit = async () => {
        api.post(props.apiPath || '/customer/login', {username: email, password: password})
            .then((response) => {
                // Save token to localStorage
                localStorage.setItem('authToken', response.data.token);  // Assuming your API returns a token
                window.location.pathname = props.redirect;
            })
            .catch((e) => {
                if (e.response) {
                    if (e.response.status === 500) setMessage('Server error');
                    else if (!e.response.data) setMessage('Unknown error');
                    else setMessage('Invalid email/password');
                } else if (e.request) setMessage('Failed to connect to server');
            });
    }


    let otherLoginPath, otherLoginText;
    if (props.isEmp === true) {
        otherLoginText = "Customer Login";
        otherLoginPath = "/login";
    } else {
        otherLoginText = "Employee Login";
        otherLoginPath = "/employee/login";
    }

    return (
        <div className='loginbox'>
            <a href="/">
                <img src={MainLogo} alt="Main Logo"/>
            </a>
            <div style={{
                fontSize: "20px",
                margin: "-18px 0px 14px 0px"
            }}>{props.title}</div>
            <hr style={{
                color: "lightgrey",
                margin: "0px 8px 16px 8px"
            }}/>
            <MessageBox message={message}/>
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
            <FancyButton text='Login' action={loginSubmit}/>
            <FancyButton text='Register'
                         action={() => window.location.pathname = props.signUp}
                         style={Object.assign({}, defaultButtonStyle, {
                             backgroundColor: "#55ACEE",
                         })}
            />
            { /* 
            <FancyButton text="Forgot password?" 
                action={() => window.location.pathname = "/"} 
                style={Object.assign({}, defaultButtonStyle, {
                    color: "blue",
                    backgroundColor: "white",
                    padding: "2px 0px",
                    width: "auto"
                })}
            />
            */}
            <FancyButton text={otherLoginText}
                         action={() => window.location.pathname = otherLoginPath}
                         style={Object.assign({}, defaultButtonStyle, {
                             color: "blue",
                             backgroundColor: "white",
                             padding: "0px 0px",
                             width: "auto"
                         })}
            />

        </div>
    );
}

export function EmployeeLoginBox(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const loginSubmit = async () => {
        api.post(props.apiPath || '/customer/login', {username: email, password: password})
            .then((response) => {
                // Save token to localStorage
                localStorage.setItem('authToken', response.data.token);  // Assuming your API returns a token
                window.location.pathname = props.redirect;
            })
            .catch((e) => {
                if (e.response) {
                    if (e.response.status === 500) setMessage('Server error');
                    else if (!e.response.data) setMessage('Unknown error');
                    else setMessage('Invalid email/password');
                } else if (e.request) setMessage('Failed to connect to server');
            });
    }


    let otherLoginPath, otherLoginText;
    if (props.isEmp === true) {
        otherLoginText = "Customer Login";
        otherLoginPath = "/login";
    } else {
        otherLoginText = "Employee Login";
        otherLoginPath = "/employee/login";
    }

    return (
        <div className='loginbox'>
            <a href="/">
                <img src={MainLogo} alt="Main Logo"/>
            </a>
            <div style={{
                fontSize: "20px",
                margin: "-18px 0px 14px 0px"
            }}>{props.title}</div>
            <hr style={{
                color: "lightgrey",
                margin: "0px 8px 16px 8px"
            }}/>
            <MessageBox message={message}/>
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
            <FancyButton text='Login' action={loginSubmit}/>
            { /*
            <FancyButton text="Forgot password?" 
                action={() => window.location.pathname = "/"} 
                style={Object.assign({}, defaultButtonStyle, {
                    color: "blue",
                    backgroundColor: "white",
                    padding: "2px 0px",
                    width: "auto"
                })}
            />
            */}
            <FancyButton text={otherLoginText}
                         action={() => window.location.pathname = otherLoginPath}
                         style={Object.assign({}, defaultButtonStyle, {
                             color: "blue",
                             backgroundColor: "white",
                             padding: "0px 0px",
                             width: "auto"
                         })}
            />

        </div>
    );
}

export function Login(props) {
    return (
        <div className='container'>
            <RandomBGImg/>
            <LoginBox
                title={props.title || 'Customer Portal'}
                redirect={props.redirect || '/'}
                signUp={props.signUp || '/signup'}
                apiPath={props.apiPath}
                isEmp={props.isEmp || false}
            /> { /* To be replaced with customer view path */}
        </div>
    );
}

export function ELogin(props) {
    return (
        <div className='container'>
            <RandomBGImg/>
            <EmployeeLoginBox
                title={props.title || 'Customer Portal'}
                redirect={props.redirect || '/'}
                signUp={props.signUp || '/signup'}
                apiPath={props.apiPath}
                isEmp={props.isEmp || false}
            /> { /* To be replaced with customer view path */}
        </div>
    );
}

export function EmployeeLogin(props) {
    return (
        <ELogin
            title={props.title || 'Employee Portal'}
            redirect={props.redirect || '/employee/access'}
            signUp={props.signUp || '/employee/signup'}
            apiPath={props.apiPath || '/employee/login'}
            isEmp={true}
        />
    );
}
