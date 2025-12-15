from django.contrib import admin
from django.urls import path
from rest_framework import routers
from storage_app.views import RegisterView
from storage_app.views import LoginView, LogoutView
from storage_app.views import AdminUsersZone,AdminFilesZone
from storage_app.views import get_csrf_token
from storage_app.views import UserFilesView

router = routers.DefaultRouter()
router.register(r'adminusers', AdminUsersZone)
router.register(r'adminfiles', AdminFilesZone)
router.register(r'ownerfiles', UserFilesView, basename='owner-files')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register',RegisterView.as_view(), name='register'),
    path('api/login', LoginView, name='login' ),
    path('api/logout', LogoutView, name='logout'),
    path('api/get-csrf/', get_csrf_token, name='get-csrf')
] 
urlpatterns += router.urls