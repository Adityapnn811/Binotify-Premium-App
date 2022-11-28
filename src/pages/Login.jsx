import { useState } from 'react'
import { Await, Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import './Login.css'

function Login() {
    let navigate = useNavigate(); 
    const routeChangeRegister = () =>{ 
        
        navigate("/register");
    }

    const loginn = async() =>{
        console.log("yeay");
    }


    const loginJSON = async() =>{
        const data = {
            "username": document.getElementById("user_name"),
            "password": document.getElementById("password")
        }
        await axios.post('http://localhost:5000/login', data).then(response=>{
            console.log("HALOOOOOOOOOOOOOOO")
            console.log(response.data)
        }).catch(err =>{
            console.log("OH NO ERRORRR")
        })
    }

    return (
        <div className="login-background">
            <div className="login-title-container">
                <a className="login-title"> BINOTIFY PREMIUM</a>
            </div>

            <a className="login-line-divider"></a>

            <div className="login-container">
                <div className="login-form-container">
                    <form class="login-form" action={loginn}>
                        <div className="login-input">
                            <label className="login-input-text" for="uname"> Email address or username </label>
                            <input type="text" class="login-input-box" id="user_name" name="user_name" placeholder="Email address or username" required/>
                        </div>

                        <div class="login-input" >
                            <label class="login-input-text"  for="pwd">Password</label>
                            <input class="login-input-box"  type="password" id="password" name="password" placeholder="Password" required/>
                        </div>

                        <div class="login-button-container">
                            <button class="login-button" name="submit" type="submit" id="submit" value="Login" > LOG IN </button>
                        </div>

                        <p class="login-line-divider"></p>

                    </form>

                    <div class="login-register-text">Don't have an account?</div>

                    <button class="login-register-button" onClick={routeChangeRegister}> SIGN UP FOR BINOTIFY </button>


                </div>
            </div>
        </div>
    )
}

export default Login