from django.db import models
from django.conf import settings

class UserSettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='user_settings')
    
    # Notification settings
    email_notifications = models.BooleanField(default=True)
    sms_notifications = models.BooleanField(default=False)
    push_notifications = models.BooleanField(default=True)
    session_reminders = models.BooleanField(default=True)
    appointment_confirmations = models.BooleanField(default=True)
    newsletter = models.BooleanField(default=False)
    marketing = models.BooleanField(default=False)
    
    # Privacy settings
    profile_visibility = models.CharField(
        max_length=20,
        choices=[
            ('private', 'Privado'),
            ('public', 'Público'),
            ('therapists', 'Solo terapeutas'),
        ],
        default='private'
    )
    data_sharing = models.BooleanField(default=False)
    analytics = models.BooleanField(default=True)
    third_party = models.BooleanField(default=False)
    
    # Device settings
    camera_enabled = models.BooleanField(default=True)
    microphone_enabled = models.BooleanField(default=True)
    speaker_enabled = models.BooleanField(default=True)
    preferred_quality = models.CharField(
        max_length=20,
        choices=[
            ('auto', 'Automático'),
            ('low', 'Baja'),
            ('medium', 'Media'),
            ('high', 'Alta'),
        ],
        default='auto'
    )
    
    # Appearance settings
    theme = models.CharField(
        max_length=20,
        choices=[
            ('auto', 'Automático'),
            ('light', 'Claro'),
            ('dark', 'Oscuro'),
        ],
        default='auto'
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name = 'Configuración de Usuario'
        verbose_name_plural = 'Configuraciones de Usuario'
    
    def __str__(self):
        return f"Configuración de {self.user.username}"
