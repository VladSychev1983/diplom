from rest_framework import serializers
from django.contrib.auth.models import User

from .validators.email_validator import is_valid_email_rgex
from .validators.password_validator import is_valid_password
from .validators.username_validator import is_valid_username
from .models import Storage

class RegisterSerializer(serializers.ModelSerializer):   
    class Meta:
        model = User
        fields = ('username','password','first_name', 'last_name','email', 'is_superuser', 'is_active', 'is_staff')
        extra_kwargs = {
            'password' : {'write_only': True}
        }

    def validate(self, data):
        # валидация данных при регистрации пользователя.
        password = data['password']
        username = data['username']
        email = data['email']
        first_name = data['first_name']
        last_name = data['last_name']

        if not all([username, password, email, first_name, last_name]):
            raise serializers.ValidationError({'error': 'Все поля обязательны.'})
        
        is_valid_password(password)
        is_valid_username(username)
        is_valid_email_rgex(email)

        return data
    def create(self, validated_data):
        instance = User.objects.create(**validated_data)
        instance.set_password(validated_data['password'])
        instance.save() 
        return instance
    
""" Admin Area Serializer"""
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

class StorageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Storage
        fields = '__all__'
        #read_only_fields = ('file')

class UserFilesSerializator(serializers.ModelSerializer):
    class Meta:
        model = Storage
        fields = fields = ['id', 'file', 'description', 'original_name', 'owner', 'uploaded_at']
        read_only_fields = ('owner','original_name',)