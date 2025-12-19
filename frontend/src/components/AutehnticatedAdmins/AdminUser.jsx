import React from "react";

function AdminUser({id, username, first_name, last_name, email, countFiles, sizeFiles, isSuper }) {
    return(
        <React.Fragment>
            <tr key={id}>
            <td>{username}</td>
            <td>{first_name}</td>
            <td>{last_name}</td>
            <td>{email}</td>
            <td>{countFiles}</td>
            <td>{sizeFiles}</td>
            <td>{isSuper == true ? (<span>admin</span>) : ("user")}</td>
            <td>Edit Delete</td>
        </tr>
        </React.Fragment>
    )
}
export default AdminUser;