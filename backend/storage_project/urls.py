"""
URL configuration for storage_project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path
from rest_framework import routers
from storage_app.views import RegisterView
from storage_app.views import LoginView
from storage_app.views import LogoutView
from storage_app.views import AdminUsersZone,AdminFilesZone
from storage_app.views import get_csrf_token

router = routers.DefaultRouter()
router.register(r'users', AdminUsersZone)
router.register(r'files', AdminFilesZone)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register',RegisterView.as_view(), name='register'),
    path('api/login', LoginView, name='login' ),
    path('api/logout', LogoutView, name='logout'),
    path('api/get-csrf/', get_csrf_token, name='get-csrf'),
]
urlpatterns += router.urls