import re
from rest_framework import serializers

def is_valid_password(password):
    if not password:
        raise serializers.ValidationError({'password_error':'Not found password'})
    if len(password) < 6:
        raise serializers.ValidationError({'password_error':'Password to short'})
    if not re.search(r'\d', password):
        raise serializers.ValidationError({'password_error':'Password must contain at least one number'})
    if not re.search(r'[A-Z]', password):
        raise serializers.ValidationError({'password_error':'Password must contain at least one uppercase letter'})   
    if not re.search(r'[!@#$%^&*()_+\-=\[\]{};:\'",.<>/?`~]', password):
        raise serializers.ValidationError({'password_error': 'Password must contain at least one special symbol'})
    return password