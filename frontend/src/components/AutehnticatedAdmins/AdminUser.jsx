import React from "react";
import { useState } from "react";
import { updateAdminUsers } from "../../apiService/requests";

function AdminUser({id, username, first_name, last_name, email, 
    countFiles, sizeFiles, isSuper, refreshUsers }) {
const [isChecked, setIsChecked] = useState(isSuper);

const handlerChecked = async (event, user_obj) => {
    console.log('[AdminUser.jsx] set checkbox:', event.target.checked)
    setIsChecked(event.target.checked)
    const { id } = user_obj;
    const data = {
        'id': id,
        'is_superuser': event.target.checked,
    }
    try {
        const response = await updateAdminUsers(data, id)
           if (!response.ok) {
        throw new Error('Ошибка при удалении файла');
      }
      refreshUsers();
    }catch (err) {
        alert(err.message);
    }
}

return(
        <React.Fragment>
            <tr key={id}>
            <td>{username}</td>
            <td>{first_name}</td>
            <td>{last_name}</td>
            <td>{email}</td>
            <td>{countFiles}</td>
            <td>{sizeFiles > 0 ? (<span>{sizeFiles} Мб </span>) : (<span>0 Мб</span>) }</td>
            <td>
            {username == 'admin' ? (
            <input type="checkbox" checked disabled/>
            ) :
            (<input type="checkbox" checked={isChecked} onChange={(e) => handlerChecked(e, {id})}/>)
                }
            </td>
            <td>Edit Delete</td>
        </tr>
        </React.Fragment>
    )
}
export default AdminUser;