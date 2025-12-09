import os
from django.db import models
from django.contrib.auth.models import User
from django.conf import settings

# Папка для хранения файлов.
STORAGE_ROOT = 'user_files'

def user_directory_path(instance, filename):
    #путь к файлу storage/user_id/filename
    return os.path.join(STORAGE_ROOT, str(instance.owner.id), filename)

# Создаем модель для хранения файлов.
class Storage(models.Model):
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='files')
    original_name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    file = models.FileField(upload_to=user_directory_path)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.owner.username}/{self.original_name}"
    
    class Meta:
        # уникальное имя файла в пределах папки пользователя.
        constraints = [ models.UniqueConstraint(fields=['owner', 'original_name'], name='unique_filename_per_user')]