from django.contrib import admin
from .models import Session, Message

@admin.register(Session)
class SessionAdmin(admin.ModelAdmin):
    list_display = ('id', 'patient', 'therapist', 'scheduled_datetime', 'status')
    list_filter = ('status', 'scheduled_datetime')
    search_fields = ('patient__user__username', 'therapist__user__username')

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ('session', 'sender', 'timestamp', 'is_read')
    list_filter = ('timestamp', 'is_read')
