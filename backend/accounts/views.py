from rest_framework import generics, status, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User, Patient, Therapist
from .serializers import (
    UserRegistrationSerializer, UserSerializer, PatientSerializer, 
    TherapistSerializer, LoginSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserRegistrationSerializer
    permission_classes = [permissions.AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Generate tokens
        refresh = RefreshToken.for_user(user)
        
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_view(request):
    serializer = LoginSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    
    user = serializer.validated_data['user']
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'user': UserSerializer(user).data,
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    })

@api_view(['GET'])
def profile_view(request):
    user = request.user
    data = UserSerializer(user).data
    
    if user.role == 'paciente' and hasattr(user, 'patient_profile'):
        data['profile'] = PatientSerializer(user.patient_profile).data
    elif user.role == 'terapeuta' and hasattr(user, 'therapist_profile'):
        data['profile'] = TherapistSerializer(user.therapist_profile).data
    
    return Response(data)

@api_view(['PUT', 'PATCH'])
def update_profile_view(request):
    """
    Actualizar el perfil del usuario
    """
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    
    if serializer.is_valid():
        serializer.save()
        
        # Actualizar perfil específico si existe
        if user.role == 'paciente' and hasattr(user, 'patient_profile'):
            profile_serializer = PatientSerializer(user.patient_profile, data=request.data.get('profile', {}), partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()
        elif user.role == 'terapeuta' and hasattr(user, 'therapist_profile'):
            profile_serializer = TherapistSerializer(user.therapist_profile, data=request.data.get('profile', {}), partial=True)
            if profile_serializer.is_valid():
                profile_serializer.save()
        
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PatientProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = PatientSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        patient, created = Patient.objects.get_or_create(user=self.request.user)
        return patient

class TherapistListView(generics.ListAPIView):
    queryset = Therapist.objects.filter(is_available=True)
    serializer_class = TherapistSerializer
    permission_classes = [permissions.IsAuthenticated]

class TherapistProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = TherapistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_object(self):
        therapist, created = Therapist.objects.get_or_create(
            user=self.request.user,
            defaults={
                'specialty': 'general',
                'license_number': f'LIC-{self.request.user.id:06d}'
            }
        )
        return therapist

@api_view(['POST'])
def logout_view(request):
    """
    Logout view - invalida el refresh token
    """
    try:
        refresh_token = request.data.get('refresh')
        if refresh_token:
            token = RefreshToken(refresh_token)
            token.blacklist()
        return Response({'message': 'Sesión cerrada exitosamente'}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({'message': 'Error al cerrar sesión'}, status=status.HTTP_400_BAD_REQUEST)
