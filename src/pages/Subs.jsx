import { useEffect, useState } from 'react'
import { Await, Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import './Login.css'
import './Subs.css'
import { useCookies } from 'react-cookie';

function Subs() {
    const [cookies, setCookie, removeCookie] = useCookies(['token']);
    const navigate = useNavigate();
    
    if (!cookies.token) {
        navigate("/login")
    }

    if (cookies.isAdmin === "false") {
        navigate('/songs')
    }

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
        removeCookie("name")
        navigate("/login")
    }

    return (
        <div className="bg-gradient-to-r from-cyan-500 to-blue-500 background-subs">
            <button onClick={logout}>Logout</button>
            <div className="subs-title">Permintaan Subscription</div>
            
            <div className="subs-body">
                <div className="subs-result"> 
                    <div className="subs-result-content">Id Penyanyi</div>
                    <div className="subs-result-content">Id Subscriber</div>
                    <div className="subs-result-content">Response</div>
                
                </div>
                <div className="title-divider"></div>
                {subs.data.map((item, i) => (
                    <div className="subs-result" key={i} >
                        <div className="subs-result-content">{item.creatorId}</div>
                        <div className="subs-result-content">{item.subscriberId}</div>
                        <div className="subs-result-content">
                            <button className="button-response-accept" onClick={(e) => {acceptSubs(e, item.creatorId, item.subscriberId)}}>Accept</button>
                            <button className="button-response-reject" onClick={(e) => {rejectSubs(e, item.creatorId, item.subscriberId)}}>Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Subs