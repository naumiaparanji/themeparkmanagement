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

async function loginSubmit(email, password) {
    fetch(apiUrl + '/customer/info', {
        credentials: 'include',
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) this.setState({username: data.user});
        else this.setState({error: data.error});
    });
    
}

export function Login() {
    return (
    <div className='container'>
        <RandomBGImg />
        <div className='loginbox'>
            <img src={MainLogo} />
            <div>
                <input name="emailInput" />
            </div>
            <div>
                <input name="passwordInput" />
            </div>
            <div>
                <button onClick={loginSubmit('wow', 'wow')}></button>
            </div>
        </div>
    </div>
    );
};
