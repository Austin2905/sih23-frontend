import "./profile.css";
import fetchUserData from "../../utils/fetchUserData"
import { useEffect, useState, useContext } from "react";
import Axios from "axios";
import { toast} from 'react-toastify'
import { AuthContext } from '../../context/auth-context'
import { useNavigate } from 'react-router-dom';

const Profile = () => {

    const [user, setUser] = useState({});
    const auth = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchData() {
            const res = await fetchUserData()
            console.log(res.data);
            setUser(res.data);
        }
        fetchData();
    }, [])

    const handleProfileDelete = () => {
        Axios.post("/user/delete")
        .then(res => {
            console.log(res);
            toast(res.data.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });   

            auth.logout()
            navigate('/auth')
        })
    }


    return (
        <div className="profile-section">
            <div className="frame">
                <div className="center">
                    <div className="profile">
                        <div className="image">
                            <div className="circle-1"></div>
                            <div className="circle-2"></div>
                            <img src="https://cdn4.vectorstock.com/i/1000x1000/75/33/flat-style-character-avatar-icon-vector-19367533.jpg" width="70" height="70" alt="Jessica Potter" />
                        </div>

                        <div className="name">{user?.username}</div>

                        <div className="actions">                           
                            <button className="btn">Edit</button>
                            <button onClick={handleProfileDelete} className="btn">Delete</button>
                        </div>
                    </div>

                    <div className="stats">
                        <div className="box">
                            <div>
                            <span className="value">{user?.age}</span>
                            <span className="parameter">Age</span>
                            </div>
                        </div>
                        <div className="box">
                            <div>
                            <span className="value">{user?.personality}</span>
                            <span className="parameter">Personality</span>
                            </div>
                        </div>
                        <div className="box">
                            <div>
                            <span className="value">{user?.email}</span>
                            <span className="parameter">Email</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile;