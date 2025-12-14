import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

function UserFilePage() {
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    //отправляем пользователя домой если не авторизован.
    if(!isAuthenticated) {
        navigate('/');
    return
    }
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