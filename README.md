# Облачное хранилище файлов.
## Данное приложение позволяте сохранять файлы и обмениваться публичными ссылками на загруженные файлы.

## Общее описание возможностей.

* Регистрация пользователя.
* Аутентификация пользователя.
* Загрузка файлов
* Возможность установить описание на загруженный файл.
* Возможность установить оригинальное имя на загруженный файл.
* Скачивание файла по прямой ссылке с оригинальным именем.
* Формирование обезличенной публичной ссылки на загруженный файл.
* Возможность удаления файла.
* Возможность редактирования файла.
* Административная панель для управления пользователями и файлами.

![Alt text](images/picture1.PNG)

## Развертывание системы на Linux Ubuntu.

1. **Клонируйте проект с использование git clone.**

2. **Создайте файл .env следующего содеражания, положите его в корень проекта (там где docker-compose.yml)**<br>
```
#Django settings
SECRET_KEY=<some key here>
DEBUG=False

#Database credentials
DB_NAME=file_storage_db
DB_USERNAME=<some user>
DB_PASSWORD=<some user password>

VITE_APP_PERSIST_KEY=<some key here>
```

3. **Добавите Ваш внешиний IP в** 
backend/storage_project/settings_sessions.py <br>
CORS_ALLOWED_ORIGINS = [<br>
'http://ваш_ip',<br>
]<br>
CSRF_TRUSTED_ORIGINS = [<br>
'http://ваш_ip',<br>
]<br>
<br>
4. Настройте Docker для работы с контейнерами.

устанавливаем вспомогательные пакеты.
sudo apt-get update
sudo apt-get install ca-certificates curl gnupg

добавляем официальный GPG key 
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

добавляем репозиторий докер в sourse.list
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

обновляем список пакетов.
sudo apt-get update

устанавливаем докер и плагин.
sudo apt-get install docker.io docker-compose docker-compose-plugin -y

устанавливаем современный сборщик.
sudo apt-get install docker-buildx-plugin