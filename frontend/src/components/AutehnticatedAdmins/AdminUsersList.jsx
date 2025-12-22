import React, { useState } from "react";
import CheckPermissionHeader from "./CheckPermissionsHeader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createAdminUser, getAdminUserInfo, getAdminUsers } from "../../apiService/requests";
import AdminUser from "./AdminUser";
import AdminFormEdit from "./AdminFormEdit";
import AdminFormAdd from "./AdminFormAdd";
import AdminUserFiles from "./AdminUserFiles";
import { updateAdminUsers } from "../../apiService/requests";

function AdminUserList(){
const [page, setPage] = useState(1);  //страницы
const queryClient = useQueryClient();

//состояния редактирования пользователя.
const [isModalOpen, setisModalOpen] = useState(null)
const [editData, setEditData] = useState(null);

//состояния добавления нового пользователя.
const [isModalOpenNewUser, setisModalOpenNewUser] = useState(null);
const [NewUserData, setNewUserData] = useState(null);

// логика TanStack Query пагинации. 
const { 
        data, 
        isLoading, 
        isError, 
        error: queryError,
        isPlaceholderData 
    } = useQuery({
        queryKey: ['users', page], // Ключ меняется когда страница меняется.
        queryFn: async () => {
            const response = await getAdminUsers(page); // передаем в getAdminUsers параметр страницы.
            if (!response.ok) throw new Error('Ошибка при загрузке списка пользователей');
            return response.json(); // Ожидаем результат. { results: [], next: url, previous: url, count: num }
        },
        placeholderData: (prev) => prev, // Отображаем данные пока происходит fetching next page
    });

//helper для обновления данных.
const refreshUsers = () => queryClient.invalidateQueries(['users']);
console.log('[AdminUsersList.jsx] got data: ',data)

//обработчик при редактировании пользователя.

const handlerEdit = async (user_id) => {
    //логика при редактировании файла.
    const response = await getAdminUserInfo(user_id);
    const data = await response.json();
    console.log('[AdminUsersList.jsx] getAdminUserInfo response:',data)
    setEditData(data);
    setisModalOpen(true);
    console.log(response);
  }

const onClose = () => {
    //при закрытии модального окна меняем состояния.
    setisModalOpen(false);
    setEditData(null)
  }

const onSave = async (updatedData, user_id) => {
    //логика обновления при редактировании.
    console.log('[AdminUsersList.jsx] data for editUser:', updatedData)
    try {
    const response = await updateAdminUsers(updatedData, user_id);
    if(response.ok) {
      console.log("Данные успешно обновлены!");
      //закрываем модальное окно и перезагружаем файлы.
      onClose();
      refreshUsers();
    } else {
      console.log("Ошибка при сохранении файла.")
    }
  } catch (error) {
    console.error("Ошибка:", error.message);
    }
}

const handlerCreateUser = () => {
    setisModalOpenNewUser(true)
}

const onCloseNewUser = () => {
    //при закрытии модального окна меняем состояния.
    setisModalOpenNewUser(false);
    setNewUserData(null)
}

const onSaveNewUser = async (userData) => {
    //логика обновления при редактировании.
    try {
    const response = await createAdminUser(userData);
    if(response.ok) {
      console.log("Данные успешно обновлены!");
      //закрываем модальное окно и перезагружаем файлы.
      onCloseNewUser();
      refreshUsers();
    } else {
      console.log("Ошибка при добавлении пользователя.")
    }
  } catch (error) {
    console.error("Ошибка:", error.message);
    }
}
//рендерим файлы пользователя.
const handlerFiles = (username, user_id) => {
    const userData = {
        'username':username,
        'user_id':user_id
    }
    console.log('Try to render files:', userData)
    // setUserObject(userData)
}

    return (
    
        <React.Fragment>
            <div>
                {/* Компонент модального окна добавления нового пользователя.. */}
      <AdminFormAdd isOpenNewUser={isModalOpenNewUser} onCloseNewUser={onCloseNewUser} onSaveNewUser={onSaveNewUser} />

                 {/* Компонент модального окна редактирования. */}
      <AdminFormEdit isOpen={isModalOpen} data={editData} onClose={onClose} onSave={onSave} />
                <h1>Управление пользователями</h1>
                <CheckPermissionHeader handlerCreateUser={handlerCreateUser} />
                 <h2>Список Пользователей</h2>
{isLoading && <p>Загрузка пользователей...</p>}
 {isError && <p style={{ color: 'red' }}>{queryError.message}</p>}
{!isLoading && data?.results?.length > 0 ? (
    <>
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
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        {/* mapping fetchdata response here */}
         {data.results.map((user) => (
        <AdminUser
        key={user.id}
        id={user.id}
        username={user.username}
        first_name={user.first_name}
        last_name= {user.last_name}
        email={user.email}
        countFiles={user?.count}
        sizeFiles={user?.size}
        isSuper={user.is_superuser}
        refreshUsers={refreshUsers}
        handlerEdit={handlerEdit}
        handlerFiles={handlerFiles}
        />
        ))}
    </tbody>
    </table>

      <div className="pagination-controls" style={{ textAlign:"center", marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center', justifyContent:"center" }}>
        <button onClick={() => setPage(old => Math.max(old - 1, 1))} disabled={page === 1}>Назад</button>
        <span>Страница { page }</span>
        <button onClick={() => { if (!isPlaceholderData && data.next) setPage(old => old + 1) }} 
        disabled={isPlaceholderData || !data.next}>Вперед</button>
        </div>
          </>
      ) : (
        !isLoading && <p>Файлы не найдены.</p>
      )}
    </div>
    </React.Fragment>
)
}

export default AdminUserList