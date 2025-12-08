from django.shortcuts import redirect, render
import logging
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsAdminUser, IsOwnerOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse, FileResponse
import os
from django.conf import settings
from .serializers import RegisterSerializer, UserSerializer

from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie

from rest_framework import viewsets

logger = logging.getLogger(__name__)
# csrf token для запросов POST/PUT/DELETE
@ensure_csrf_cookie
def get_csrf_token(request):
    logger.info(f"CSRF token from {request.META.get('REMOTE_ADDR')}")
    return JsonResponse({'detail':"CSRF cookie set."})

# регистрация нового пользователя.
class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            instance = serializer.save()
            return JsonResponse({"msg": f"Username {request.data['username']} was created!"}, status=201)
        #username = request.data.get('name')
        #print(f'{username}')
        return JsonResponse({"post": "ok"})

# аутентификация пользователей.
@csrf_exempt
def LoginView(request):
    if request.method == 'POST':
        username = request.POST.get('username',None)
        password = request.POST.get('password', None)
        print(f"{username}")
        print(f"{password}")
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            response = JsonResponse({"msg":"Authorization was successful"})
            response.set_cookie("sessionid", request.session.session_key)
            return response
        else:
            return JsonResponse({"msg":"Incorrect credentials"})
    else:
        return JsonResponse({"msg":"Method is not allowed."})

# выход пользователей.
def LogoutView(request):
    if request.user.is_authenticated:
        logout(request)
        response = JsonResponse({'msg':"Logout was successful"})
        response.delete_cookie("sessionid")
        return response
    else:
        return JsonResponse({'msg':"User is not auth"})

"""
Admin Zone Security
"""
User = get_user_model()
class AdminUsersZone(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes= [IsAuthenticated, IsAdminUser]