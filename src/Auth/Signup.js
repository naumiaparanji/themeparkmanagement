import './Auth.css'
import React, {useState} from 'react';
import MainLogo from '../images/flagslogo.png';
import {defaultButtonStyle, FancyButton, InputField, MessageBox, RandomBGImg, Validation} from './AuthComponents';
import {api} from '../App';

export function SignUpBox(props) {
    // Added new states for the additional fields
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [dob, setDob] = useState('');
    const [address, setAddress] = useState('');
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
        // Send the additional fields as part of the registration request
        api.post(props.apiPath || '/customer/register',
            {
                firstName: firstName,
                lastName: lastName,
                dob: dob,
                address: address,
                username: email,
                password: password
            }
        )
            .then(() => window.location.pathname = props.redirect)
            .catch((e) => {
                if (e.response) {
                    if (e.response.status === 500) setMessage('Server error');
                    else if (e.response.status === 409) setMessage('An account with this email already exists');
                    else if (!e.response.data) setMessage('Unknown error');
                    else setMessage('Sign-up failed');
                } else if (e.request) setMessage('Failed to connect to server');
            });
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
                name="First Name"
                containerStyle={{margin: "12px 12px"}}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <InputField
                name="Last Name"
                containerStyle={{margin: "12px 12px"}}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <InputField
                name="Date of Birth"
                type="date"
                containerStyle={{margin: "12px 12px"}}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
            />
            <InputField
                name="Address"
                containerStyle={{margin: "12px 12px"}}
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />

            <InputField
                name="Email"
                containerStyle={{margin: "12px 12px"}}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <InputField
                name="Password"
                type="password"
                containerStyle={{margin: "12px 12px"}}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <InputField
                name="Confirm Password"
                type="password"
                containerStyle={{margin: "12px 12px"}}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <FancyButton text='Sign Up' action={signUpSubmit}/>
            <div><p>Already have an account?</p></div>
            <FancyButton text='Login'
                         action={() => window.location.pathname = props.login}
                         style={{...defaultButtonStyle, backgroundColor: "#55ACEE"}}
            />
        </div>
    );
}

export function SignUp(props) {
    return (
        <div className='container'>
            <RandomBGImg/>
            <SignUpBox
                title={props.title || 'Customer Sign-Up'}
                redirect={props.redirect || '/login'}
                login={props.login || '/login'}
                apiPath={props.apiPath}
            />
        </div>
    );
};

export function EmployeeSignup(props) {
    // TEMPORARY UNTIL REGISTRATION VIEW FOR MANAGERS, ADMINS, ETC IS COMPLETE
    // Also will fail bc there aren't enough fields
    return (
        <SignUp
            title={props.title || 'Employee Sign-Up'}
            redirect={props.redirect || '/employee/login'}
            login={props.login || '/employee/login'}
            apiPath={props.apiPath || '/employee/register'}
        />
    );
}
