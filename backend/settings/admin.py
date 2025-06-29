from django.contrib import admin
from .models import UserSettings

@admin.register(UserSettings)
class UserSettingsAdmin(admin.ModelAdmin):
    list_display = ['user', 'email_notifications', 'push_notifications', 'profile_visibility', 'theme', 'updated_at']
    list_filter = ['email_notifications', 'push_notifications', 'profile_visibility', 'theme', 'created_at']
    search_fields = ['user__username', 'user__email', 'user__first_name', 'user__last_name']
    readonly_fields = ['created_at', 'updated_at']
    
    fieldsets = (
        ('Usuario', {
            'fields': ('user',)
        }),
        ('Notificaciones', {
            'fields': (
                'email_notifications', 'sms_notifications', 'push_notifications',
                'session_reminders', 'appointment_confirmations', 'newsletter', 'marketing'
            )
        }),
        ('Privacidad', {
            'fields': ('profile_visibility', 'data_sharing', 'analytics', 'third_party')
        }),
        ('Dispositivo', {
            'fields': ('camera_enabled', 'microphone_enabled', 'speaker_enabled', 'preferred_quality')
        }),
        ('Apariencia', {
            'fields': ('theme',)
        }),
        ('Información del Sistema', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
