import React, {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormUpload from "./FormUpload";
import { getFiles, deleteFile, get_csrf_token, downloadFile } from "../../apiService/requests";
import { getFileInfo, editFile } from "../../apiService/requests";
import FormEdit from "./FormEdit";
import { useQuery, useQueryClient } from "@tanstack/react-query";

function FileStorage() {
    const navigate = useNavigate();
    const queryClient = useQueryClient(); //added.
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const sessionid = useSelector((state) => state.user.sessionid);
    //состояния редактирования файлов.
    const [isModalOpen, setisModalOpen] = useState(null);
    const [editData, setEditData] = useState(null);
    // пагинация.
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
            get_csrf_token();
            const response = await getFiles(page); // передаем в getFiles параметр страницы.
            if (!response.ok) throw new Error('Ошибка при загрузке списка файлов');
            return response.json(); // Ожидаем результат. { results: [], next: url, previous: url, count: num }
        },
        placeholderData: (prev) => prev, // Отображаем данные пока происходит fetching next page
    });

    //helper для обновления данных.
    const refreshFiles = () => queryClient.invalidateQueries(['files']);

    const handleDelete = async (id) => {
    try {
      // Запрос на удаление файла
      const response = await deleteFile(id);

      if (!response.ok) {
        throw new Error('Ошибка при удалении файла');
      }
      // Обновление списка файлов после успешного удаления
      refreshFiles();
    } catch (err) {
      alert(err.message);
    }
  };
    //запрос на загрузку файла.
    const handleDownload = async (e, file_id, file_name) => {
      e.preventDefault(); 
      try {
        setIsDownloading(true)
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
        setIsDownloading(false)
      }
    };

  const handleEdit = async (file_id) => {
    //логика при редактировании файла.
    const response = await getFileInfo(file_id);
    const data = await response.json();
    console.log('[FileStorage.jsx] getFileInfo response:',data)
    setEditData(data);
    setisModalOpen(true);
    console.log(response);
  }
  const onClose = () => {
    //при закрытии модального окна меняем состояния.
    setisModalOpen(false);
    setEditData(null)
  }
  const onSave = async (updatedData, file_id) => {
    //логика обновления при редактировании.
    try {
    const response = await editFile(updatedData, file_id);
    if(response.ok) {
      console.log("Файл успешно обновлен!");
      //закрываем модальное окно и перезагружаем файлы.
      onClose();
      refreshFiles();
    } else {
      console.log("Ошибка при сохранении файла.")
    }
  } catch (error) {
    console.error("Ошибка сохранения:", error);
    }
  }

    return (
    <React.Fragment>
          <div>
      {/* Компонент модального окна редактирования. */}
      <FormEdit isOpen={isModalOpen} data={editData} onClose={onClose} onSave={onSave} />
      <h1>Хранилище файлов</h1>
      {/* Компонент формы загрузки файлов */}
      <FormUpload onUploadSuccess={refreshFiles} />
      
      <h2>Список файлов</h2>
      {isLoading && <p>Загрузка файлов...</p>}
      {isError && <p style={{ color: 'red' }}>{queryError.message}</p>}
      {isDownloading && <p style={{ color: 'blue' }}>Подготовка файла к скачиванию...</p>}
      {!isLoading && data?.results?.length > 0 ? (
        <>
        <table className="files_table" border="1" cellPadding="10">
          <thead>
            <tr>
              <th>ID</th>
              <th>Оригинальное имя</th>
              <th>Описание</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {data.results.map((file) => (
              <tr key={file.id}>
                <td>{file.id}</td>
                <td>
 {/* Ссылка на скачивание файла */}
                  <a href="#" rel="noopener noreferrer" onClick={(e) => handleDownload(e, file.id, file.original_name)}>
                    {file.original_name}
                  </a>
                </td>
                <td>{file.description}</td>
                <td>
                  <button onClick={() => handleEdit(file.id)}>Редактировать</button>
                  <button onClick={() => {if (window.confirm(`Вы уверены, что хотите удалить файл ${file.original_name}`)) {  handleDelete(file.id)}}}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pagination-controls" style={{ textAlign:"center", marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
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
export default FileStorage;