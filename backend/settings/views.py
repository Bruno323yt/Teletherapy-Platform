from django.shortcuts import render
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import UserSettings
from .serializers import UserSettingsSerializer, SettingsUpdateSerializer

# Create your views here.

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_settings(request):
    """
    Obtener las configuraciones del usuario
    """
    try:
        user_settings = UserSettings.objects.get(user=request.user)
        serializer = UserSettingsSerializer(user_settings)
        return Response(serializer.data)
    except UserSettings.DoesNotExist:
        # Crear configuraciones por defecto si no existen
        user_settings = UserSettings.objects.create(user=request.user)
        serializer = UserSettingsSerializer(user_settings)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_settings(request):
    """
    Actualizar las configuraciones del usuario
    """
    try:
        user_settings = UserSettings.objects.get(user=request.user)
    except UserSettings.DoesNotExist:
        user_settings = UserSettings.objects.create(user=request.user)
    
    # Validar datos de entrada
    update_serializer = SettingsUpdateSerializer(data=request.data)
    if not update_serializer.is_valid():
        return Response(update_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # Actualizar configuraciones según el tipo
    data = update_serializer.validated_data
    
    if 'notifications' in data:
        notification_fields = [
            'email_notifications', 'sms_notifications', 'push_notifications',
            'session_reminders', 'appointment_confirmations', 'newsletter', 'marketing'
        ]
        for field in notification_fields:
            if field in data['notifications']:
                setattr(user_settings, field, data['notifications'][field])
    
    if 'privacy' in data:
        privacy_fields = ['profile_visibility', 'data_sharing', 'analytics', 'third_party']
        for field in privacy_fields:
            if field in data['privacy']:
                setattr(user_settings, field, data['privacy'][field])
    
    if 'device' in data:
        device_fields = ['camera_enabled', 'microphone_enabled', 'speaker_enabled', 'preferred_quality']
        for field in device_fields:
            if field in data['device']:
                setattr(user_settings, field, data['device'][field])
    
    if 'appearance' in data:
        if 'theme' in data['appearance']:
            user_settings.theme = data['appearance']['theme']
    
    user_settings.save()
    
    # Retornar configuraciones actualizadas
    serializer = UserSettingsSerializer(user_settings)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reset_settings(request):
    """
    Restablecer las configuraciones a valores por defecto
    """
    try:
        user_settings = UserSettings.objects.get(user=request.user)
        user_settings.delete()
    except UserSettings.DoesNotExist:
        pass
    
    # Crear nuevas configuraciones con valores por defecto
    user_settings = UserSettings.objects.create(user=request.user)
    serializer = UserSettingsSerializer(user_settings)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
