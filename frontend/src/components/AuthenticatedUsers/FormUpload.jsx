import React, { useState } from "react";
import { uploadFile } from "../../apiService/requests";

const FormUpload = ({ onUploadSuccess }) => {
//const userData = useSelector((state) => state.user?.userData);
const [file, setFile] = useState(null);
const [description, setDescription] = useState('');
const [uploading, setUploading] = useState(false);
const [message, setMessage] = useState('');
const [originalname, setOriginalName] = useState('');

const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setMessage('Пожалуйста, выберите файл.');
      return;
    }
    setUploading(true);
    setMessage('');
    // проверяем существовоние полей desciprion и original_name
    const uploadedFileName = file.name;
    const finalOriginalName = originalname || uploadedFileName;
    const finalDescriptionName = description || finalOriginalName;

// Использование объекта FormData для multipart/form-data запроса
const formData = new FormData();
formData.append('file', file); // 'file' - имя поля, ожидаемое на сервере
formData.append('description', finalDescriptionName); // Дополнительные данные
formData.append('original_name', finalOriginalName);

const fetchData =  async (formData) => {
try {
      const response = await uploadFile(formData);
      if (!response.ok) {
        throw new Error('Ошибка загрузки файла');
      }

      const result = await response.json();
      setMessage(`Файл успешно загружен: ${result.original_name}`);
      setFile(null);
      setDescription('');
      setOriginalName('');

      // Вызов функции обратного вызова для обновления списка файлов в родительском компоненте
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (err) {
      setMessage(`Ошибка: ${err.message}`);
    } finally {
      setUploading(false);
    }
}
if(setUploading) {
    fetchData(formData);
}
  };

return (
    <React.Fragment>
        <div>
             <form onSubmit={handleSubmit} style={{ display: "inline-flex", alignItems: "center" }}>
      <h3>Загрузить файл</h3>
      <div style={{ margin: "10px"}}>
        <input
        className="upload_form_input"
          type="text"
          placeholder="Описание файла"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={uploading}
        />
      </div>
      <div>
        <input
          className="upload_form_input"
          type="text"
          placeholder="Оригинальное имя"
          value={originalname}
          onChange={(e) => setOriginalName(e.target.value)}
          disabled={uploading}
        />
      </div>
        <div style={{ marginLeft: "20px"}}>
        <input type="file" className="upload_form_file" onChange={handleFileChange} disabled={uploading} />
      </div>
      <button className="upload_form_submit" type="submit" disabled={uploading} style={{ textAlign: "center"}}>
        {uploading ? 'Загрузка...' : 'Загрузить'}
      </button>
      {message && <p style={{ marginTop: '10px', color: message.startsWith('Ошибка') ? 'red' : 'green' }}>{message}</p>}
    </form>
        </div>
    </React.Fragment>
);
};
export default FormUpload;