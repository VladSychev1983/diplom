from rest_framework import serializers
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth.models import User

from .validators.email_validator import is_valid_email_rgex
from .validators.password_validator import is_valid_password
from .validators.username_validator import is_valid_username

import re

class RegisterSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = User
        fields = ('username','password','first_name', 'last_name','email')
        extra_kwargs = {
            'password' : {'write_only': True}
        }

    def validate(self, data):
            # validate here data['password']
            # username состоит и латинских букв и цифр, первый символ буква, длина от 4 до 20
            # email это email
            # пароль 6 символов 1 цифра 1 заглавная и 1 спец символ
        password = data['password']
        username = data['username']
        email = data['email']
 
        is_valid_password(password)
        is_valid_username(username)
        is_valid_email_rgex(email)

        return data
    def create(self, validated_data):
        instance = User.objects.create(**validated_data)
        instance.set_password(validated_data['password'])
        instance.save() 
        return instance