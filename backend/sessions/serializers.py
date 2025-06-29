from rest_framework import serializers
from .models import Session, Message
from accounts.serializers import PatientSerializer, TherapistSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender_name = serializers.CharField(source='sender.get_full_name', read_only=True)
    
    class Meta:
        model = Message
        fields = ['id', 'content', 'timestamp', 'sender', 'sender_name', 'is_read']
        read_only_fields = ['id', 'timestamp', 'sender', 'sender_name']

class SessionSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source='patient.user.get_full_name', read_only=True)
    therapist_name = serializers.CharField(source='therapist.user.get_full_name', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    messages = MessageSerializer(many=True, read_only=True)
    
    class Meta:
        model = Session
        fields = '__all__'
        read_only_fields = ['id', 'video_link', 'created_at', 'updated_at']

class SessionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['therapist', 'scheduled_datetime', 'duration_minutes']
    
    def create(self, validated_data):
        # Get patient from request user
        patient = self.context['request'].user.patient_profile
        validated_data['patient'] = patient
        return super().create(validated_data)
