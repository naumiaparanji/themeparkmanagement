import './Auth.css'
import BgA from '../images/login-a.jpg'
import BgB from '../images/login-b.jpg'
import BgC from '../images/login-c.jpg'
import BgD from '../images/login-d.jpg'

export const defaultInputStyle = {
    boxSizing: 'border-box',
    padding: "12px",
    fontSize: "14px",
    margin: "0px",
    width: "100%",
    borderRadius: "8px", 
    border: "grey 1px solid"
};

export const defaultButtonStyle = {
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

export const defaultMessageStyle = {
    color: "red"
}

export const defaultContainerStyle = {
    margin: "12px"
};

export const BgImgs = [BgA, BgB, BgC, BgD];

export function RandomBGImg() {
    const currentImageIndex = Math.floor(Math.random() * BgImgs.length);
    return (
      <div
        id="login-bg"
        style={{ backgroundImage: `url(${BgImgs[currentImageIndex]})` }}
      ></div>
    );
  }

  export function InputField(props) {
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

export function FancyButton(props) {
    return (
        <div style={props.containerStyle || defaultContainerStyle}>
            <button 
              style={props.style || defaultButtonStyle}
              onClick={props.action}>{props.text}
            </button>
        </div>
    );
}

export function MessageBox(props) {    
    return (props.message?
        <div style={props.containerStyle || defaultContainerStyle}>
            <p style={props.style || defaultMessageStyle}>
                {props.message}
            </p>
        </div>
        : (null)
    );
};

export function Validation(values) {
    let error = {email: "", password: ""};

    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (values.email === "") error.email = "Email cannot be empty";
    else if (!email_pattern.test(values.email)) error.email = "Must be a valid email address";

    if(values.password === "") error.password = "Password cannot be empty";
    else if (values.password.length < 8) error.password = "Password must be at least 8 characters long";
    else if (!/[A-Z]/.test(values.password)) error.password = "Password must have at least one uppercase letter";
    else if (!/[a-z]/.test(values.password)) error.password = "Password must have at least one lowercase letter";
    else if (!/[0-9]/.test(values.password)) error.password = "Password must have at least one numeric character";

    return error;
}
