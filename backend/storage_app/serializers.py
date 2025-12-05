from rest_framework import serializers
from django.contrib.auth.models import User
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
        if not password:
            raise serializers.ValidationError('Not found password')
        if len(password) < 6:
             raise serializers.ValidationError('Password to short')
        if not re.search(r'\d', password):
             raise serializers.ValidationError({'error':'Password must contain at least one number'})
        if not re.search(r'[A-Z]', password):
             raise serializers.ValidationError('Password must contain at least one uppercase letter')
        if not re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>/?`~]', password):
             raise serializers.ValidationError('Password must contain at least one special symbol')
        return data

         
    def create(self, validated_data):
        instance = User.objects.create(**validated_data)
        return instance