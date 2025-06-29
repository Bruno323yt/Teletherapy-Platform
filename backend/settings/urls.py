from django.urls import path
from . import views

app_name = 'settings'

urlpatterns = [
    path('', views.get_settings, name='get_settings'),
    path('update/', views.update_settings, name='update_settings'),
    path('reset/', views.reset_settings, name='reset_settings'),
] 