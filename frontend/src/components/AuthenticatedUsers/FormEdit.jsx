import React from "react";

const FormEdit = ({data, isOpen, onClose, onSave}) => {
    if (!isOpen || !data) return null;

    return (
        <React.Fragment>
<div className="modal-overlay">
      <div className="modal-content">
        <h2>Редактировать файл</h2>
        <form onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          // Обновленные данные возвращаем в onSave handler.
          console.log('[FormEdit.jsx] send formData:', formData)
          onSave(Object.fromEntries(formData), data.id);
        }}>
          <label>Оригинальное имя:</label>
          <input type="text" name="original_name" defaultValue={data.original_name}></input>        
          <label>Описание:</label>
          <textarea name="description" defaultValue={data.description}></textarea> 

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Отмена</button>
            <button type="submit">Сохранить</button>
          </div>
        </form>
      </div>
    </div>
</React.Fragment>    
);
};
export default FormEdit