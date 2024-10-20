import './Login.css'
import { apiUrl } from './App';
import React, { useState, useEffect } from 'react';
import MainLogo from './flagslogo.png';
import BgA from './login-a.jpg'
import BgB from './login-b.jpg'
import BgC from './login-c.jpg'
import BgD from './login-d.jpg'

const BgImgs = [BgA, BgB, BgC, BgD];

export default function RandomBGImg() {
    const [currentImageIndex, setCurrentImageIndex] = useState(Math.floor(Math.random() * BgImgs.length))
    const changeImage = () => {
      const randomNumber = Math.floor(Math.random() * BgImgs.length);
      setCurrentImageIndex(randomNumber);
    }
    useEffect(() => changeImage(), [])

    return (
        <div id="login-bg" style={{ backgroundImage: `url(${BgImgs[currentImageIndex]})` }}></div>
    )
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

const InputField = React.forwardRef((props, ref) => {
    const [value, setValue] = useState(props.default || '');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div style={props.containerStyle || defaultContainerStyle}>
            <input
              style={props.style || defaultInputStyle}
              onChange={handleChange}
              type={props.type || 'text'}
              value={value}
              ref={ref}
              placeholder={props.name || ''}
            />
        </div>
    );
});

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

class LoginBox extends React.Component {
    constructor(props) {
        super(props);
        this.EmailField = React.createRef();
        this.PasswordField = React.createRef();
        
        this.state = {
            message: ''
        };
    }

    loginSubmit = async () => {
        try {
            const response = await fetch(apiUrl + '/customer/login', {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: this.EmailField.current.value, 
                    password: this.PasswordField.current.value
                }),
            });
            const data = await response.json();
            if (data.success) {
                window.location.pathname = this.props.redirect;
            } else {
                this.setState({message: 'Invalid email/password'});
            }
        } catch (error) {
            console.log(error);
        }
    }

    render() {

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
                <MessageBox message={this.state.message} />
                <InputField name="Email" containerStyle={{margin: "0px 12px"}} ref={this.EmailField} />
                <InputField name="Password" type="password" ref={this.PasswordField} />
                <FancyButton text='Login' action={this.loginSubmit} />
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
}

export function Login() {
    return (
    <div className='container'>
        <RandomBGImg />
        <LoginBox redirect="/" />
    </div>
    );
};
