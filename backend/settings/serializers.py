from rest_framework import serializers
from .models import UserSettings

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = [
            'email_notifications',
            'sms_notifications', 
            'push_notifications',
            'session_reminders',
            'appointment_confirmations',
            'newsletter',
            'marketing',
            'profile_visibility',
            'data_sharing',
            'analytics',
            'third_party',
            'camera_enabled',
            'microphone_enabled',
            'speaker_enabled',
            'preferred_quality',
            'theme',
            'created_at',
            'updated_at'
        ]
        read_only_fields = ['created_at', 'updated_at']

class SettingsUpdateSerializer(serializers.Serializer):
    notifications = serializers.DictField(required=False)
    privacy = serializers.DictField(required=False)
    device = serializers.DictField(required=False)
    appearance = serializers.DictField(required=False) 