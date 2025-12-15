# Поскольку Django и React - разные источники, ставим Lax
CSRF_COOKIE_SAMESITE = 'Lax'
SESSION_COOKIE_SAMESITE = 'Lax'

# Чтобы cookie не были доступны из JS, нужен атрибут HttpOnly
CSRF_COOKIE_HTTPONLY = True
SESSION_COOKIE_HTTPONLY = False

# Домены, которым мы доверяем
CSRF_TRUSTED_ORIGINS = ['http://localhost:8000','http://127.0.0.1:5173','http://localhost:5173']

# Когда приложение заимеет production окружение и https соединение
# CSRF_COOKIE_SECURE = True
# SESSION_COOKIE_SECURE = True

# Время жизни сессии в секундах. По умолчанию 2 недели = 1209600
#SESSION_COOKIE_AGE = 120 <- для примера 120 секунд
SESSION_COOKIE_AGE = 86400 * 7

#SESSION_SAVE_EVERY_REQUEST = True

# Чтобы убивать сессию при закрытии браузера
#SESSION_EXPIRE_AT_BROWSER_CLOSE = True

# Разрешаем межсайтовые запросы для домена, на котором находится React приложение
CORS_ALLOWED_ORIGINS = [
  'http://localhost:8000',  
  'http://127.0.0.1:5173',
  'http://localhost:5173', 
]

# Разрешаем заголовки для межсайтовых запросов
CORS_EXPOSE_HEADERS = ['Content-Type', 'X-CSRFToken']

# Разрешаем отправлять cookie при межсайтовых запросах на разрешённые домены:
SESSION_ENGINE = 'django.contrib.sessions.backends.db'
CORS_ALLOW_CREDENTIALS = True
# Использование CSRF токенов хранится в сессиях
#CSRF_USE_SESSIONS = True

# Разрешаем любые CORS запросы. (не рекомендуется для продакшена)
CORS_ALLOW_ALL_ORIGINS = True
SECURE_CROSS_ORIGIN_OPENER_POLICY=None
CORS_ALLOW_METHODS = [ 'GET', 'POST', 'PUT', 'DELETE', 'PATCH']