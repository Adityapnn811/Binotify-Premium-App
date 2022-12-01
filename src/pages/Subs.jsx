import { useState } from 'react'
import { Await, Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import './Login.css'
import './Subs.css'
import { useCookies } from 'react-cookie';

function Login() {
    const jsonnya = {
        "data": [
            {
                "creatorId": "1",
                "status": "PENDING",
                "subscriberId": "1"
            },
            {
                "creatorId": "1",
                "status": "PENDING",
                "subscriberId": "3"
            },
            {
                "creatorId": "2",
                "status": "PENDING",
                "subscriberId": "3"
            },
            {
                "creatorId": "2",
                "status": "PENDING",
                "subscriberId": "4"
            }
        ]
    }


    return (
        <div class="bg-gradient-to-r from-cyan-500 to-blue-500" className='background-subs'>
            <div class="subs-title">Permintaan Subscription</div>
            
            <div class="subs-body">
                <div class="subs-result"> 
                    <div class="subs-result-content">Id Penyanyi</div>
                    <div class="subs-result-content">Id Subscriber</div>
                    <div class="subs-result-content">Response</div>
                
                </div>
                <div class="title-divider"></div>
                {jsonnya.data.map((item, i) => (
                    <div class="subs-result" key={i}>
                        <div class="subs-result-content">{item.creatorId}</div>
                        <div class="subs-result-content">{item.subscriberId}</div>
                        <div class="subs-result-content">
                            <button class="button-response-accept">Accept</button>
                            <button class="button-response-reject">Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Login