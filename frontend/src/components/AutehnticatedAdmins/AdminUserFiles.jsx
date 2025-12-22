import React, {useEffect, useState} from "react";
import { useParams } from 'react-router-dom';
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";	
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminUserFiles } from "../../apiService/requests";
import CopyButton from "../AuthenticatedUsers/CopyButton";
import { HOST_URL } from "../../apiService/requests";
import { downloadFile } from "../../apiService/requests";

function AdminUserFiles() {
    const { id, username } = useParams();   // получаем параметры из router.
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const isAuthenticated = useSelector((state) => state.user?.isAuthenticated);
    const sessionid = useSelector((state) => state.user?.sessionid);

    const [page, setPage] = useState(1);  //страницы
    const [isDownloading, setIsDownloading] = useState(false);
    //отправляем пользователя домой если не авторизован.
    useEffect(() => {
    if(!sessionid && !isAuthenticated) {
        navigate('/');
    return
    }
    },[sessionid, isAuthenticated, navigate])

    // логика TanStack Query пагинации. 
    const { 
        data, 
        isLoading, 
        isError, 
        error: queryError,
        isPlaceholderData 
    } = useQuery({
        queryKey: ['files', page], // Ключ меняется когда страница меняется.
        queryFn: async () => {
            const response = await getAdminUserFiles(id, page); // передаем в getFiles параметр страницы.
            if (!response.ok) throw new Error('Ошибка при загрузке списка файлов');
            return response.json(); // Ожидаем результат. { results: [], next: url, previous: url, count: num }
        },
        placeholderData: (prev) => prev, // Отображаем данные пока происходит fetching next page
    });

    //helper для обновления данных.
    const refreshFiles = () => queryClient.invalidateQueries(['files']);
    
    const handleNoramlizeDate = (somedate) => {
  if (!somedate) return '-'

  const date = new Date(somedate);
  //const normalDate = date.toLocaleDateString(); //format date 2025/12/9
  const formattedDate = new Intl.DateTimeFormat('ru-RU', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
}).format(date);

  return formattedDate;
 }
 const handleDelete =() =>{
    console.log('click deleted')
 }
     //запрос на загрузку файла.
    const handleDownload = async (e, file_id, file_name) => {
      e.preventDefault(); 
      try {
        setIsDownloading(true);
        const response = await downloadFile(file_id);
      if(!response.ok) {
        throw new Error('Ошибка загрузки файла.')
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href =url;
      link.setAttribute('download',`${file_name}`)
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      } catch (error) {
        console.log('Ошибка загрузки файла', error)
      } finally {
        setIsDownloading(false);
        refreshFiles();
      }
    }; 

console.log(id)

    return (
        <React.Fragment>
            <div>
                <h1>Управление файлами пользователя</h1>
                <h3>Список файлов пользователя {username}</h3>
                 {isLoading && <p>Загрузка файлов...</p>}
      {isError && <p style={{ color: 'red' }}>{queryError.message}</p>}
      {isDownloading && <p style={{ color: 'blue' }}>Подготовка файла к скачиванию...</p>}
      {!isLoading && data?.results?.length > 0 ? (
        <>
        <table className="files_table" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Дата загрузки</th>
              <th>Дата скачивания</th>
              <th>Оригинальное имя</th>
              <th>Размер</th>
              <th>Описание</th>
              <th>Публичная ссылка</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((file) => (
              <tr key={file.id}>
                <td>{file.id}</td>
                <td>{handleNoramlizeDate(file.uploaded_at)}</td>
                 <td>{handleNoramlizeDate(file.downloaded_at)}</td>
                <td>
 {/* Ссылка на скачивание файла */}
                  <a href="#" rel="noopener noreferrer" onClick={(e) => handleDownload(e, file.id, file.original_name)}>
                    {file.original_name}
                  </a>
                </td>
                <td>
                  { file.size > 0 ? (<span> {file.size} MB</span>) : ("0 МБ")}
                </td>
                <td>{file.description}</td>
                <td> 
                    <CopyButton linkToCopy={`${HOST_URL}/api/download/${file.secret_name}`}/>
                    {/* {file.secret_name} */}
                </td>
                <td>
                  <button onClick={() => {if (window.confirm(`Вы уверены, что хотите удалить файл ${file.original_name}`)) {  handleDelete(file.id)}}}>Удалить</button>
                </td>
              </tr>
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

export default AdminUserFiles