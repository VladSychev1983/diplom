import re
from rest_framework import serializers

def is_valid_password(password):
    if not password:
        raise serializers.ValidationError({'password_error':'Пароль не найден'})
    if len(password) < 6:
        raise serializers.ValidationError({'password_error':'Пароль слишком короткий.  Должен быть менее 6 символов: как минимум одна заглавная буква, одна цифра и один специальный символ'})
    if not re.search(r'\d', password):
        raise serializers.ValidationError({'password_error':'Пароль должен содержать минимум 1 цифру'})
    if not re.search(r'[A-Z]', password):
        raise serializers.ValidationError({'password_error':'Пароль должен содержать минимум 1 букву в верхнем регистре'})   
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>/?`~]', password):
        raise serializers.ValidationError({'password_error': 'Пароль должен содержать минимум 1 спец. символ'})
    return password