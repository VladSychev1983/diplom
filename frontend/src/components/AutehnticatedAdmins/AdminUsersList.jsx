import React, { useState } from "react";
import CheckPermissionHeader from "./CheckPermissionsHeader";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminUsers } from "../../apiService/requests";
import AdminUser from "./AdminUser";


function AdminUserList(){
const [page, setPage] = useState(1);  //страницы
const queryClient = useQueryClient();

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
// eslint-disable-next-line no-unused-vars
const refreshFiles = () => queryClient.invalidateQueries(['users']);
console.log('[AdminUsersList.jsx] got data: ',data)

    return (
        <React.Fragment>
            <div>
                <h1>Управление пользователями</h1>
                <CheckPermissionHeader />
                 <h2>Список Пользователей</h2>
{isLoading && <p>Загрузка файлов...</p>}
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