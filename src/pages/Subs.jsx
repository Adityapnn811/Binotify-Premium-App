import { useEffect, useState } from 'react'
import { Await, Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import './Login.css'
import './Subs.css'
import { useCookies } from 'react-cookie';

function Subs() {
    let navigate = useNavigate(); 
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
            },
            {
                "creatorId": "3",
                "status": "PENDING",
                "subscriberId": "1"
            },
            {
                "creatorId": "3",
                "status": "PENDING",
                "subscriberId": "2"
            },
            {
                "creatorId": "3",
                "status": "PENDING",
                "subscriberId": "3"
            },
            {
                "creatorId": "3",
                "status": "PENDING",
                "subscriberId": "4"
            }
        ]
    }
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [subs, setSubs] = useState({data: []});
    const [isOneElement, setIsOneElement] = useState(false);
    // fetch data using useEffect
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(
                'http://localhost:5000/subscription',
                {headers: {Authorization: "Bearer " + cookies.token}});
            if (result.data.data.creatorId) {
                setSubs({data: [result.data.data]});
            } else {
                setSubs(result.data);
            }
        };
        fetchData();
    }, []);

    // accept subscription
    const acceptSubs = async (e, creatorId, subscriberId) => {
        e.preventDefault();
        const data = {
            "creator_id": creatorId,
            "subscriber_id": subscriberId
        }
        await axios.post('http://localhost:5000/subscription/approve', data, {
            headers: {Authorization: "Bearer " + cookies.token}
        }).catch(err => {
            console.log(err)
        })
        //reload
        window.location.href = "/subscription";
    }

    // reject subscription
    const rejectSubs = async (e, creatorId, subscriberId) => {
        e.preventDefault();
        const data = {
            "creator_id": creatorId,
            "subscriber_id": subscriberId
        }
        await axios.post('http://localhost:5000/subscription/reject', data, {
            headers: {Authorization: "Bearer " + cookies.token}
        }).catch(err => {
            console.log(err)
        })
        //reload
        window.location.href = "/subscription";
    }
    // validate cookie
    const logout = () => {
        removeCookie("token")
        removeCookie("isAdmin")
        navigate("/login")
    }
    if (!cookies.token) {
        navigate("/login")
    }
    if (cookies.isAdmin === "false") {
        return (
            <div>
                <button onClick={logout}>Logout</button>
                <h1>Not Authorized</h1>
            </div>
        )
    }
    return (
        <div class="bg-gradient-to-r from-cyan-500 to-blue-500" className='background-subs'>
            <div class="subs-navbar">
                <button class="subs-logout-button" onClick={logout}>
                        Logout
                </button>
            </div>

            <div class="subs-title">Permintaan Subscription</div>
            
            <div class="subs-body">
                <div class="subs-result"> 
                    <div class="subs-result-content">Id Penyanyi</div>
                    <div class="subs-result-content">Id Subscriber</div>
                    <div class="subs-result-content">Response</div>
                
                </div>
                <div class="title-divider"></div>
                {jsonnya.data.map((item, i) => (
                    <div class="subs-result" key={i} >
                        <div class="subs-result-content">{item.creatorId}</div>
                        <div class="subs-result-content">{item.subscriberId}</div>
                        <div class="subs-result-content">
                            <button class="button-response-accept" onClick={(e) => {acceptSubs(e, item.creatorId, item.subscriberId)}}>Accept</button>
                            <button class="button-response-reject" onClick={(e) => {rejectSubs(e, item.creatorId, item.subscriberId)}}>Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Subs