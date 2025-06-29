from django.db import models
from django.conf import settings
import uuid

class Session(models.Model):
    STATUS_CHOICES = [
        ('scheduled', 'Programada'),
        ('confirmed', 'Confirmada'),
        ('in_progress', 'En Progreso'),
        ('completed', 'Completada'),
        ('cancelled', 'Cancelada'),
        ('no_show', 'No Asistió'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient = models.ForeignKey('accounts.Patient', on_delete=models.CASCADE, related_name='sessions')
    therapist = models.ForeignKey('accounts.Therapist', on_delete=models.CASCADE, related_name='sessions')
    scheduled_datetime = models.DateTimeField()
    duration_minutes = models.IntegerField(default=60)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='scheduled')
    video_link = models.URLField(blank=True)
    therapist_notes = models.TextField(blank=True)
    patient_feedback = models.TextField(blank=True)
    rating = models.IntegerField(null=True, blank=True, help_text="1-5 stars")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-scheduled_datetime']
    
    def __str__(self):
        return f"Sesión {self.id} - {self.patient.user.get_full_name()} con {self.therapist.user.get_full_name()}"
    
    def save(self, *args, **kwargs):
        if not self.video_link and self.status in ['confirmed', 'in_progress']:
            # Generate Jitsi link
            room_name = f"therapy-session-{self.id}"
            self.video_link = f"https://{settings.JITSI_DOMAIN}/{room_name}"
        super().save(*args, **kwargs)

class Message(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['timestamp']
    
    def __str__(self):
        return f"Mensaje de {self.sender.username} en sesión {self.session.id}"
