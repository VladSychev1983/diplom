from django.shortcuts import redirect, render
from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsAdminUser, IsOwnerOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse, FileResponse
import os
from .serializers import RegisterSerializer, UserSerializer, StorageSerializer

from django.contrib.auth.models import User
from .models import Storage

from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie

from rest_framework import viewsets
from storage_project.settings import logger

from django.contrib.sessions.models import Session
# csrf token для запросов POST/PUT/DELETE
@ensure_csrf_cookie
def get_csrf_token(request):
    logger.info(f"CSRF token from {request.META.get('REMOTE_ADDR')}")
    return JsonResponse({'detail':"CSRF cookie set."})

#получаем user id из сессии.
def get_user_id_from_session_key(session_key):
    try:
        session = Session.objects.get(session_key=session_key)
        session_data = session.get_decoded()
        uid = session_data.get('_auth_user_id')
        if uid:
            return uid
    except Session.DoesNotExist:
        pass
    return None

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
        else:
            return JsonResponse({"error": "User is not created"})

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
        request.session.flush()
        response.delete_cookie("sessionid")
        return response
    else:
        return JsonResponse({'msg':"User is not auth"})

"""
Admin Secret Zone
"""
#запросы администратора управления пользователями /users
User = get_user_model()
class AdminUsersZone(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes= [IsAuthenticated, IsAdminUser]

#запросы администратора управления файлами /files
class AdminFilesZone(viewsets.ModelViewSet):
    queryset = Storage.objects.all()
    serializer = StorageSerializer(queryset, many=True)
    permission_classes= [IsAuthenticated, IsAdminUser]

    def get_serializer_class(self):
        return StorageSerializer

    def list(self, request):
        #user_id = request.user.id
        #get session id from session.
        session_key = request.session.session_key
        user_id = get_user_id_from_session_key(session_key)
        if user_id:
            queryset = Storage.objects.all().order_by('-uploaded_at')
            serializer = StorageSerializer(queryset, many=True)
            print(f"[info] User with id={user_id} is requested all files.")
        else:
            Response({'error':'Сессия пользователя не найдена.'})
        return Response(serializer.data)
