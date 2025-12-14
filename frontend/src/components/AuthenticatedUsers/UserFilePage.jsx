import React, {useEffect} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function UserFilePage() {
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const sessionid = useSelector((state) => state.user.sessionid);
    //отправляем пользователя домой если не авторизован.
    useEffect(() => {
    if(!sessionid && !isAuthenticated) {
        navigate('/');
    return
    }
    },[sessionid, isAuthenticated, navigate])
    return (
    <React.Fragment>
        <div>
            <h1>Files Page</h1>.
            <p>Some files here</p>
        </div>
    </React.Fragment>  
)
}
export default UserFilePage;