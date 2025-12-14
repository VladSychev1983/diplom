from rest_framework.permissions import IsAuthenticated, AllowAny
from .permissions import IsAdminUser, IsOwnerOrReadOnly
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import serializers
from django.http import JsonResponse, FileResponse
from .serializers import RegisterSerializer, UserSerializer, StorageSerializer
from .serializers import UserFilesSerializator
from django.contrib.auth.models import User
from .models import Storage
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth import get_user_model
from django.http import HttpResponseRedirect
from django.views.decorators.csrf import csrf_exempt, ensure_csrf_cookie
from rest_framework import viewsets
from django.contrib.sessions.models import Session
import logging
import json

logger = logging.getLogger(__name__)

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

#получаем ip address запроса.
def get_client_ip(request):
    x_forwarded_header = request.META.get('HTTP_X_FORWARDED_FOR')
    if  x_forwarded_header:
        ip = x_forwarded_header.split(',')[0]
    else:
        ip = request.META.get('REMOTE_ADDR')
    return ip

# регистрация нового пользователя.
class RegisterView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user_instance = serializer.save()
            login(request, user_instance)
            response_data = {
                "success":f"Username {request.data['username']} was created and logged in!",
                 "data": RegisterSerializer(user_instance).data
            }
            logger.info(f'[INFO] Getted a request for registering user from IP {get_client_ip(request)}')
            logger.info(f"[INFO] Username {request.data['username']} was created and logged in!")
            return  Response(data=response_data, status=201)
        else:
            logger.info(f'[INFO] Getted a request for registering user from IP {get_client_ip(request)}')
            logger.warning(f'[ERR] ERROR Username {request.data['username']} was not created!')
            return JsonResponse({"error": "User is not created"})

# аутентификация пользователей.
@csrf_exempt
def LoginView(request):
    if request.method == 'POST':
        # username = request.POST.get('username', None)
        # password = request.POST.get('password', None)
        # json format data
        data =json.loads(request.body)
        username = data.get('username')
        password = data.get('password')

        print(f"{username}")
        print(f"{password}")
        print(request)
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            response = JsonResponse({"success":"Authorization was successful"})
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
        response = JsonResponse({'success':"Logout was successful"})
        request.session.flush()
        response.delete_cookie("sessionid")
        return response
    else:
        return JsonResponse({'error':"User is not auth"})

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
            print(f"[info] User with id={user_id} requests all files.")
        else:
            Response({'error':'Сессия пользователя не найдена.'})
        return Response(serializer.data)

"""
Authentificated Users Zone 
"""

class UserFilesView(viewsets.ModelViewSet):
    queryset = Storage.objects.all()
    serializer_class = UserFilesSerializator
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]
    #каждый пользователь видит только свои файлы.
    def get_queryset(self):
        return Storage.objects.filter(owner=self.request.user).order_by('-uploaded_at')
    
    def perform_create(self, serializer):
        uploaded_file = self.request.FILES.get('file')
        if not uploaded_file:
            logger.warning("No files are attached in the request")
            raise serializers.ValidationError("No file part in the request")
        owner_id = self.request.user.id
        owner = self.request.user
        filename = uploaded_file.name
        print(f"owner_id ={owner_id} ,  owner={owner} filename={filename}")

        if Storage.objects.filter(owner_id=owner_id, original_name=filename).exists():
            logger.info(f"User with id= {owner_id} uploaded {filename} named exists in storage")
            raise serializers.ValidationError({'file': f"file named {filename}  already exists in storage."})
        
        #сохраняем запись.
        instance = serializer.save(owner=owner,original_name=filename)
        logger.info(f"User {self.request.user.username} uploaded file {instance.original_name}")
