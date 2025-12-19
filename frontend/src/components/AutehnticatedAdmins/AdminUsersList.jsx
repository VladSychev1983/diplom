import React from "react";
import CheckPermissionHeader from "./CheckPermissionsHeader";


function AdminUserList(){
    return (
        <React.Fragment>
            <div>
                <h1>Управление пользователями</h1>
                <CheckPermissionHeader />
        <table className="files_table" border="1" cellPadding="10">
      <thead>
        <tr>
          <th>Пользователь</th>
          <th>Имя</th>
          <th>Фамилия</th>
          <th>Email</th>
          <th>Количество файлов</th>
          <th>Размер</th>
          <th>Администратор</th>
        </tr>
      </thead>
      <tbody>
        {/* mapping fetchdata response here */}
        <tr>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
            <td></td>
        </tr>
    </tbody>
    </table>
            </div>
        </React.Fragment>
)
}
export default AdminUserList