import { useState } from 'react'
import { Await, Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import './Login.css'
import { useCookies } from 'react-cookie';

function Login() {
    const [cookies, setCookie, removeCookie] = useCookies(['token', 'isAdmin', 'name']);
    const navigate = useNavigate();

    if (cookies.token) {
        navigate("/songs");
    }

    const routeChangeRegister = () =>{ 
        navigate("/register");
    }

    const [errorLoginMsg, seterrorLoginMsg] = useState("");

    const loginJSON = async (e) =>{
        e.preventDefault();
        console.log("MASUK SINI")
        const data = {
            "username": document.getElementById("user_name").value,
            "password": document.getElementById("password").value,
        }
        console.log(data)
        await axios.post('http://localhost:5000/login', data).then(response=>{
            console.log("HALOOOOOOOOOOOOOOO")
            console.log("ini response.data")
            console.log(response.data)
            console.log("ini response")
            console.log(response)
            console.log("ini cookie")
            setCookie("token", response.data.token)
            setCookie("isAdmin", response.data.data.isAdmin)
            setCookie("name", response.data.data.name)
            console.log(cookies.token, cookies.isAdmin, cookies.name)
            seterrorLoginMsg(response.data.data)

        }).catch(err =>{
            console.log("DIA KESINI")
            // console.log(err.response.data.error)
            seterrorLoginMsg(err.response.data.data)
            
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
                    {errorLoginMsg && <div className='login-error-msg'> {errorLoginMsg} </div>}   
                    <form className="login-form">
                        <div className="login-input">
                            <label className="login-input-text" htmlFor="uname"> Email address or username </label>
                            <input type="text" className="login-input-box" id="user_name" name="user_name" placeholder="Email address or username" required/>
                        </div>

                        <div className="login-input" >
                            <label className="login-input-text"  htmlFor="pwd">Password</label>
                            <input className="login-input-box"  type="password" id="password" name="password" placeholder="Password" required/>
                        </div>

                        <div className="login-button-container">
                            <button className="login-button" name="submit" id="submit" value="Login" onClick={(e) => loginJSON(e)}> LOG IN </button>
                        </div>

                        <p className="login-line-divider"></p>

                    </form>

                    <div className="login-register-text">Don't have an account?</div>

                    <button className="login-register-button" onClick={routeChangeRegister}> SIGN UP FOR BINOTIFY </button>


                </div>
            </div>
        </div>
    )
}

export default Login