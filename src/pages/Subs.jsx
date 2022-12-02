import { useEffect, useState } from 'react'
import { Await, Link, useNavigate } from "react-router-dom"
import axios from 'axios'
import './Login.css'
import './Subs.css'
import { useCookies } from 'react-cookie';

function Subs() {
    let navigate = useNavigate(); 
    const [cookies, setCookie, removeCookie] = useCookies(['user']);
    const [subs, setSubs] = useState({data: []});
    const [page, setPage] = useState(1);
    const [totalPage, setTotalPage] = useState(0);

    // fetch data using useEffect
    useEffect(() => {
        const fetchData = async () => {
            const result = await axios.get(
                'http://localhost:5000/subscription/' + page,
                {headers: {Authorization: "Bearer " + cookies.token}});
            if (result.data.data.creatorId) {
                setSubs({data: [result.data.data]});
                setTotalPage(result.data.pages)
            } else {
                setSubs(result.data);
                setTotalPage(result.data.pages);
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

    // render data
    const addPage = async () => {
        console.log(page)
        let pageNew = page + 1
        const result = await axios.get(
            'http://localhost:5000/subscription/' + pageNew,
            {headers: {Authorization: "Bearer " + cookies.token}});
        if (result.data.data.creatorId) {
            setSubs({data: [result.data.data]});
        } else {
            setSubs(result.data);
        }
        setPage(pageNew);
    }

    const substractPage = async () => {
        console.log(page)
        let pageNew = page - 1
        const result = await axios.get(
            'http://localhost:5000/subscription/' + pageNew,
            {headers: {Authorization: "Bearer " + cookies.token}});
        if (result.data.data.creatorId) {
            setSubs({data: [result.data.data]});
        } else {
            setSubs(result.data);
        }
        setPage(pageNew);
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
            <div class='button-container'>
                {page > 1 ?<button onClick={substractPage} class="button-response-text">Prev</button> : null}
                {page < totalPage ? <button onClick={addPage} class="button-response-text">Next</button> : null}
            </div>

        </div>
    )
}

export default Subs