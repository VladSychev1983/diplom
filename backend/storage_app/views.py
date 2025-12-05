from django.shortcuts import redirect, render
from rest_framework.permissions import AllowAny
from .permissions import IsAdminUser, IsOwnerOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse, FileResponse
import os
from django.conf import settings
from .serializers import RegisterSerializer

# регистрация нового пользователя.
class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            instance = serializer.save()
            return JsonResponse({"User created": "ok"}, status=201)
        #username = request.data.get('name')
        #print(f'{username}')
        return JsonResponse({"post": "ok"})

