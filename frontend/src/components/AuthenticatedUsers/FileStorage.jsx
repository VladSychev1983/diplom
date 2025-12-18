import React, {useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormUpload from "./FormUpload";
import { getFiles, deleteFile, get_csrf_token, downloadFile } from "../../apiService/requests";
import { getFileInfo, editFile } from "../../apiService/requests";
import FormEdit from "./FormEdit";

function FileStorage() {
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.user.isAuthenticated);
    const sessionid = useSelector((state) => state.user.sessionid);
    //состояния отображения файлов.
    const [files, setFiles] = useState([])
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //состояния редактирования файлов.
    const [isModalOpen, setisModalOpen] = useState(null);
    const [editData, setEditData] = useState(null);
    
    //отправляем пользователя домой если не авторизован.
    useEffect(() => {
    if(!sessionid && !isAuthenticated) {
        navigate('/');
    return
    }
    },[sessionid, isAuthenticated, navigate])

    const fetchFiles = async () => {
    try {
      setLoading(true);
      get_csrf_token();
      // Запрос списка файлов к API
      const response = await getFiles();
      if (!response.ok) {
        throw new Error('Ошибка при загрузке списка файлов');
      }
      const data = await response.json();
      console.log('[FileStorage.jsx] fetch files data:',data)
      setFiles(data); // Ожидается массив объектов файлов
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);


    const handleDelete = async (id) => {
    try {
      // Запрос на удаление файла
      const response = await deleteFile(id);

      if (!response.ok) {
        throw new Error('Ошибка при удалении файла');
      }
      // Обновление списка файлов после успешного удаления
      fetchFiles();
    } catch (err) {
      setError(err.message);
    }
  };
    //запрос на загрузку файла.
    const handleDownload = async (e, file_id, file_name) => {
      e.preventDefault(); 
      try {
        setLoading(true)
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
        setLoading(false)
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
      fetchFiles();
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
      <FormUpload onUploadSuccess={fetchFiles} />
      
      <h2>Список файлов</h2>
      {loading && <p>Загрузка файлов...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && files.length > 0 ? (
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
            {files.map((file) => (
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
      ) : (
        !loading && <p>Файлы не найдены.</p>
      )}
    </div>
    </React.Fragment>
)
}
export default FileStorage;