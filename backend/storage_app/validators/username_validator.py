from rest_framework import serializers

def is_valid_username(username):
    if not(4 <= len(username) <= 20):
        raise serializers.ValidationError({'username_error':'Long of username is not right.'})
    if not username[0].isalpha():
        raise serializers.ValidationError({'username_error':'First letter must be a letter.'})
    if not username.isalnum():
        raise serializers.ValidationError({'username_error':'All characters are alphanumeric'})
    return username        