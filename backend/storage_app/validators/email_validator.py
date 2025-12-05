import re
from rest_framework import serializers

def is_valid_email_rgex(email):
    regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    if not re.fullmatch(regex, email):
        raise serializers.ValidationError({'email_error':'Неправильный email'})
    return email