import React, { useState } from 'react';
import './Register.css'
import axios from 'axios'
import { useCookies } from 'react-cookie';

const isEmail = (email) =>
    /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email);

function Register(){
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    
    const [values, setValues] = useState("");
    const [errorMsg, seterrorMsg] = useState("");

    const [errorRegisterMsg, seterrorRegisterMsg] = useState("");

    const validateEmail = event =>{
        console.log("yeay")
        console.log(values)
        if(event.target.value == ""){
            console.log("aaaaaaaa")
            seterrorMsg("You need to enter your email")
        }else{
            if (!isEmail(event.target.value)) {
                seterrorMsg("This email is invalid. Make sure it's written like example@email.com");
            } else {
                seterrorMsg(null);
            }
        }
        setValues(event.target.value);
    }

    const registerJSON = async (e) =>{
        e.preventDefault();
        //username, password, email, name
        console.log("MASUK SINI")
        const data = {
            "username": document.getElementById("username").value,
            "password": document.getElementById("password").value,
            "email": document.getElementById("email").value,
            "name": document.getElementById("name").value
        }
        console.log(data)
        await axios.post('http://localhost:5000/register', data).then(response=>{
            // console.log("HALOOOOOOOOOOOOOOO")
            // console.log(response.data)
            // console.log(response)
            setCookie("token", response.data.token)
            setCookie("isAdmin", response.data.data.isAdmin)
            // console.log(cookies)

        }).catch(err =>{
            // console.log(response.data)
            console.log("OH NO ERRORRR")
            console.log(err.response.data.error)
            seterrorRegisterMsg(err.response.data.error)
            
        })
    }

    return(

        <div className="login-background">
            <div className="login-title-container">
                <a className="login-title"> BINOTIFY </a>
            </div>
                <div className="login-container">
                    <div className="login-form-container">
                        {errorRegisterMsg && <div className='register-error-msg'> {errorRegisterMsg} </div>}
                        <form method="post" className="login-form">
                            <div className="login-input">
                                <label className="login-input-text" for="username" required> Username </label>
                                <input className="login-input-box" placeholder="Enter your username" type="text" name="username" id="username" required onkeyup="processUsernameChange(this.value)"/>
                            </div>
                            
                            <div className="login-input">
                                <label className="login-input-text" requires> Email </label>
                                <input className="login-input-box" placeholder="Enter your email" type="text" name="email" id="email" onChange={validateEmail}/>

                                {errorMsg && <div className='register-error-msg-ajax'> {errorMsg} </div>}
                            </div>

                            <div className="login-input">
                                <label className="login-input-text" required> Password </label>
                                <input className="login-input-box" placeholder="Enter your password" type="password" name="password" id="password" required/>
                            </div>

                            <div className="login-input">
                                <label className="login-input-text" required> Confirm Password </label>
                                <input className="login-input-box" placeholder="Enter your password again" type="password" name="confirm_password" required/>
                            </div>

                            <div className="login-input">
                                <label className="login-input-text" required> What should we call you? </label>
                                <input className="login-input-box" placeholder="Enter a profile name" type="text" name="name" id="name" required/>
                            </div>

                            <div className="register-button-container">
                                <button className="register-button" value="Submit" id="registerButton" onClick={(e) => registerJSON(e)}> SIGN UP </button>
                            </div>
                            
                        </form> 
                            <p className="register-login-button">
                                Have an account?
                                <a className="register-href" href="/login">Login</a>
                            </p>

                    </div>
            </div>
        </div>
    )
}

export default Register