document.getElementById('uploadForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Предотвращаем стандартную отправку формы

    const formData = new FormData(); // Создаем объект FormData
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0]; // Получаем выбранный файл

    formData.append('file', file); // Добавляем файл в FormData (имя 'file' должно соответствовать тому, что ожидает API)

    try {
        const response = await fetch('http://localhost:8000/owners/', {
            method: 'POST',
            body: formData, // Отправляем объект FormData
            // Заголовки Content-Type устанавливаются автоматически для FormData
            headers: {
                'X-CSRFToken': 'JMHsb5Cb5Jfnofgj7MBtFk35uJBBV7XR',
                'cookie': 'sessionid=c5beknkvdutxzdwdfobodf7n3dgjuaek',
                'cookie': 'csrftoken=JMHsb5Cb5Jfnofgj7MBtFk35uJBBV7XR',
                'Origin': 'http://localhost:3000' 
            },
            cookie: {
                'csrftoken': 'JMHsb5Cb5Jfnofgj7MBtFk35uJBBV7XR',
                'sessionid': 'c5beknkvdutxzdwdfobodf7n3dgjuaek',
            },
            credentials: 'include'
        });

        if (response.ok) {
            const result = await response.json();
            console.log('Успешно:', result);
            alert('Файл загружен!');
        } else {
            console.error('Ошибка:', response.status);
            alert('Ошибка загрузки файла.');
        }
    } catch (error) {
        console.error('Сетевая ошибка:', error);
        alert('Проблема с сетью.');
    }
});