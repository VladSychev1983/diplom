import React from "react";
import { useParams } from 'react-router-dom';

function AdminUserFiles() {
const { id, username } = useParams();

console.log(id)

    return (
        <React.Fragment>
            <div>
                <h1>Управление файлами пользователя</h1>
                <h3>Список файлов пользователя {username}</h3>
            </div>
        </React.Fragment>
    )
}

export default AdminUserFiles