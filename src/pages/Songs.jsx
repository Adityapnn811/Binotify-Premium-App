import './Songs.css'

import { useState, useEffect } from 'react'
import { useCookies } from 'react-cookie'
import { useNavigate, useSearchParams } from "react-router-dom"
import { useForm } from "react-hook-form";
import axios from 'axios'

const Songs = () => {
    // Initialize
    const [cookies, setCookie, removeCookie] = useCookies(['token'])
    const navigate = useNavigate()

    // Must Be Logged In
    if (!cookies.token) {
        navigate('/login')
    }

    // Must Not Be Admin
    if (cookies.isAdmin !== "false") {
        navigate('/subscription')
    }

    // Upsert Hook
    const [searchParams, setSearchParams] = useSearchParams()
    const { register, handleSubmit } = useForm();

    // Hooks
    const [currentPage, setCurrentPage] = useState(1)
    const [isLoading, setLoading] = useState(true);
    const [songList, setSongList] = useState();

    const post = async (data) => {
        const formData = new FormData()
        formData.append("judul", data.judul)
        formData.append("lagu", data.lagu[0])

        const query = await axios.post("http://localhost:5000/songs", formData, {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).catch(err => {
            console.log(err);
        })
        window.location.href = '/songs'
    }

    const put = async (data) => {
        const formData = new FormData()
        formData.append("judul", data.judul)
        formData.append("lagu", data.lagu[0])

        const query = await axios.put("http://localhost:5000/songs/" + data.song_id, formData, {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).catch(err => {
            console.log(err);
        })
        window.location.href = '/songs'
    }

    const postSong = () => {
        window.location.href = '/songs?mode=add'
    }

    const logout = () => {
        removeCookie("token")
        removeCookie("isAdmin")
        removeCookie("name")
        navigate("/login")
    }

    const updateSong = (id) => {
        window.location.href = '/songs?mode=edit&song_id=' + id
    }

    const deleteSong = (id) => {
        axios.delete("http://localhost:5000/songs/" + id, {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).then(
            window.location.href = '/songs'
        ).catch(err => {
            console.log(err);
        })
    }

    if (searchParams.get("mode") == "add") {
        return (
            <div className='App'>
                <div className='banner'>{"Welcome, " + cookies.name}</div>
                <div className="formEdit">
                    <form onSubmit={handleSubmit(post)}>
                        <div className='label'>
                            <label htmlFor="judul" id="labelJudul">Judul</label>
                            <input type="text" className="inputField" name="judul" id="inputJudul" placeholder='placeholder = "e.x. Smoke on the Water' required {...register("judul")}/>
                        </div>
                        <input type="file" name="lagu" accept="audio/*" required {...register("lagu")}/>
                        <input className='button' type="submit"/>
                    </form>
                </div>
                <div id='logout' className='button-red' onClick={logout}>{"Log Out"}</div>
            </div>
        )
    }

    if (searchParams.get("mode") == "edit") {
        const song_id = searchParams.get("song_id")
        return (
            <div className='App'>
                <div className='banner'>{"Welcome, " + cookies.name}</div>
                <div className="formEdit">
                    <form onSubmit={handleSubmit(put)}>
                        <div className='label'>
                            <label htmlFor="judul" id="labelJudul">Judul</label>
                            <input type="text" className="inputField" name="judul" id="inputJudul" placeholder='placeholder = "e.x. Smoke on the Water' required {...register("judul")}/>
                        </div>
                        <input type="file" name="lagu" accept="audio/*" required {...register("lagu")}/>
                        <input type="hidden" name="song_id" value={song_id} {...register("song_id")}/>
                        <input className="button" type="submit"/>
                    </form>
                </div>
                <div id='logout' className='button-red' onClick={logout}>{"Log Out"}</div>
            </div>
        )
    }

    useEffect(() => {
        axios.get("http://localhost:5000/penyanyi/songs", {
            headers: {
                Authorization: "Bearer " + cookies.token
            }
        }).then(res => {
            setSongList(res.data.data)
            setLoading(false)
        }).catch(err => {
            setSongList([])
        })
    }, [])

    if (isLoading) {
        return <div className="App">Loading...</div>
    }

    if (songList.length == 0) {
        return (
            <div className='App'>
                <div className='banner'>{"Welcome, " + cookies.name}</div>
                No Songs Yet
                <div id='new' className='button' onClick={postSong}>{"New"}</div>
                <div id='logout' className='button-red' onClick={logout}>{"Log Out"}</div>
            </div>
        )
    }

    const pages = Math.ceil(songList.length / 4)

    const pageList = () => {
        const pageList = []
        var left = 0
        var right = 0

        if (currentPage == 1) {
            left = 1
            right = Math.min(pages, 3)
        } else if (currentPage == pages) {
            left = Math.max(1, pages - 2)
            right = pages
        } else {
            left = Math.max(1, currentPage - 1)
            right = Math.min(pages, currentPage + 1)
        }

        for (let i = left; i <= right; i++) {
            pageList.push(
                <div className={currentPage === i ? "current" : "other"}
                    onClick={() => {
                        setCurrentPage(i)
                    }}
                    key={i}>
                    {i}
                </div>
            )
        }
        return pageList
    }

    return (
        <div className='App'>
            <div className='banner'>{"Welcome, " + cookies.name}</div>
            {songList && songList.map((song, index) => {
                if (index >= (currentPage - 1) * 4 && index < currentPage * 4) {
                    return (
                        <div className='songCard' key={index}>
                            <div className='title'>{song.Judul}</div>
                            <div className='buttons'>
                                <div className='button' onClick={ (e) => updateSong(e.target.id) } id={song.song_id}>{"Edit"}</div>
                                <div className='button-red' onClick={ (e) => deleteSong(e.target.id) } id={song.song_id}>{"Delete"}</div>
                            </div>
                        </div>
                    )
                }
            })}
            <div className="pagination">
                <div className={"arrow-far-left" + (currentPage === 1 ? "-inactive" : "")}
                     onClick={() => {
                        if (currentPage !== 1) {
                            setCurrentPage(1)
                        }
                     }}>
                </div>
                <div className={"arrow-left" + (currentPage === 1 ? "-inactive" : "")}
                     onClick={() => {
                        if (currentPage !== 1) {
                            setCurrentPage(currentPage - 1)
                        }
                     }}>
                </div>

                {pageList()}
                
                <div className={"arrow-right" + (currentPage === pages ? "-inactive" : "")}
                     onClick={() => {
                        if (currentPage !== pages) {
                            setCurrentPage(currentPage + 1)
                        }
                     }}>
                </div>

                <div className={"arrow-far-right" + (currentPage === pages ? "-inactive" : "")}
                     onClick={() => {
                        if (currentPage !== pages) {
                            setCurrentPage(pages)
                        }
                     }}>
                </div>
            </div>
            <div id='new' className='button' onClick={postSong}>{"New"}</div>
            <div id='logout' className='button-red' onClick={logout}>{"Log Out"}</div>
        </div>
    )
}

export default Songs