import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv("DB_NAME"),
        'USER': os.getenv("DB_USERNAME"),
        'PASSWORD': os.getenv("DB_PASSWORD"),
        'HOST': 'db',
        'PORT': '5432',
    }
}
