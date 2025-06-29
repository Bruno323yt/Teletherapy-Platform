from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.utils import timezone
from datetime import timedelta
from .models import Session, Message
from .serializers import SessionSerializer, SessionCreateSerializer, MessageSerializer

class SessionListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return SessionCreateSerializer
        return SessionSerializer
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'paciente':
            return Session.objects.filter(patient__user=user)
        elif user.role == 'terapeuta':
            return Session.objects.filter(therapist__user=user)
        return Session.objects.none()

class SessionDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = SessionSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        user = self.request.user
        if user.role == 'paciente':
            return Session.objects.filter(patient__user=user)
        elif user.role == 'terapeuta':
            return Session.objects.filter(therapist__user=user)
        return Session.objects.none()

@api_view(['POST'])
def confirm_session(request, session_id):
    try:
        session = Session.objects.get(id=session_id, therapist__user=request.user)
        session.status = 'confirmed'
        session.save()
        return Response({'message': 'Sesión confirmada'})
    except Session.DoesNotExist:
        return Response({'error': 'Sesión no encontrada'}, status=404)

@api_view(['POST'])
def cancel_session(request, session_id):
    try:
        user = request.user
        if user.role == 'paciente':
            session = Session.objects.get(id=session_id, patient__user=user)
        elif user.role == 'terapeuta':
            session = Session.objects.get(id=session_id, therapist__user=user)
        else:
            return Response({'error': 'No autorizado'}, status=403)
        
        # Only allow cancellation if session is more than 24 hours away
        if session.scheduled_datetime - timezone.now() < timedelta(hours=24):
            return Response({'error': 'No se puede cancelar con menos de 24 horas de anticipación'}, status=400)
        
        session.status = 'cancelled'
        session.save()
        return Response({'message': 'Sesión cancelada'})
    except Session.DoesNotExist:
        return Response({'error': 'Sesión no encontrada'}, status=404)

@api_view(['POST'])
def start_session(request, session_id):
    try:
        session = Session.objects.get(id=session_id, therapist__user=request.user)
        session.status = 'in_progress'
        session.save()
        return Response({
            'message': 'Sesión iniciada',
            'video_link': session.video_link
        })
    except Session.DoesNotExist:
        return Response({'error': 'Sesión no encontrada'}, status=404)

class SessionMessagesView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        session_id = self.kwargs['session_id']
        user = self.request.user
        
        # Verify user has access to this session
        if user.role == 'paciente':
            session_exists = Session.objects.filter(id=session_id, patient__user=user).exists()
        elif user.role == 'terapeuta':
            session_exists = Session.objects.filter(id=session_id, therapist__user=user).exists()
        else:
            session_exists = False
        
        if not session_exists:
            return Message.objects.none()
        
        return Message.objects.filter(session_id=session_id)
    
    def perform_create(self, serializer):
        session_id = self.kwargs['session_id']
        serializer.save(
            session_id=session_id,
            sender=self.request.user
        )

@api_view(['GET'])
def therapist_availability(request, therapist_id):
    """Get available time slots for a therapist"""
    from accounts.models import Therapist
    from datetime import datetime, date
    
    try:
        therapist = Therapist.objects.get(id=therapist_id)
    except Therapist.DoesNotExist:
        return Response({'error': 'Terapeuta no encontrado'}, status=404)
    
    # Get next 7 days
    available_slots = []
    today = date.today()
    
    for i in range(7):
        check_date = today + timedelta(days=i)
        weekday = check_date.weekday()  # 0=Monday, 6=Sunday
        
        # Check if therapist is available on this day
        day_available = False
        if weekday == 0 and therapist.monday_available:
            day_available = True
        elif weekday == 1 and therapist.tuesday_available:
            day_available = True
        elif weekday == 2 and therapist.wednesday_available:
            day_available = True
        elif weekday == 3 and therapist.thursday_available:
            day_available = True
        elif weekday == 4 and therapist.friday_available:
            day_available = True
        elif weekday == 5 and therapist.saturday_available:
            day_available = True
        elif weekday == 6 and therapist.sunday_available:
            day_available = True
        
        if day_available:
            # Generate hourly slots between start_time and end_time
            current_time = datetime.combine(check_date, therapist.start_time)
            end_time = datetime.combine(check_date, therapist.end_time)
            
            while current_time < end_time:
                # Check if slot is already booked
                is_booked = Session.objects.filter(
                    therapist=therapist,
                    scheduled_datetime=current_time,
                    status__in=['scheduled', 'confirmed', 'in_progress']
                ).exists()
                
                if not is_booked:
                    available_slots.append({
                        'datetime': current_time.isoformat(),
                        'date': check_date.isoformat(),
                        'time': current_time.strftime('%H:%M')
                    })
                
                current_time += timedelta(hours=1)
    
    return Response({'available_slots': available_slots})
