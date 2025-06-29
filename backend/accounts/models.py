from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ('paciente', 'Paciente'),
        ('terapeuta', 'Terapeuta'),
        ('admin', 'Administrador'),
    ]
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='paciente')
    phone = models.CharField(max_length=15, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    bio = models.TextField(blank=True, help_text="Biografía del usuario")
    timezone = models.CharField(max_length=50, default='America/Mexico_City')
    language = models.CharField(max_length=10, default='es')
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

    def __str__(self):
        return f"{self.username} ({self.role})"

class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='patient_profile')
    initial_test_completed = models.BooleanField(default=False)
    anxiety_level = models.IntegerField(null=True, blank=True, help_text="1-10 scale")
    depression_level = models.IntegerField(null=True, blank=True, help_text="1-10 scale")
    stress_level = models.IntegerField(null=True, blank=True, help_text="1-10 scale")
    main_concerns = models.TextField(blank=True)
    previous_therapy = models.BooleanField(default=False)
    
    def __str__(self):
        return f"Paciente: {self.user.get_full_name() or self.user.username}"

class Therapist(models.Model):
    SPECIALTY_CHOICES = [
        ('ansiedad', 'Trastornos de Ansiedad'),
        ('depresion', 'Depresión'),
        ('trauma', 'Trauma y TEPT'),
        ('pareja', 'Terapia de Pareja'),
        ('familia', 'Terapia Familiar'),
        ('adolescentes', 'Adolescentes'),
        ('adicciones', 'Adicciones'),
        ('general', 'Psicología General'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='therapist_profile')
    specialty = models.CharField(max_length=20, choices=SPECIALTY_CHOICES)
    license_number = models.CharField(max_length=50, unique=True)
    years_experience = models.IntegerField(default=0)
    bio = models.TextField(blank=True)
    hourly_rate = models.DecimalField(max_digits=8, decimal_places=2, default=0)
    average_rating = models.DecimalField(max_digits=3, decimal_places=2, default=0)
    is_available = models.BooleanField(default=True)
    
    # Availability (simplified - in production you'd want a more complex schedule system)
    monday_available = models.BooleanField(default=True)
    tuesday_available = models.BooleanField(default=True)
    wednesday_available = models.BooleanField(default=True)
    thursday_available = models.BooleanField(default=True)
    friday_available = models.BooleanField(default=True)
    saturday_available = models.BooleanField(default=False)
    sunday_available = models.BooleanField(default=False)
    
    start_time = models.TimeField(default='09:00')
    end_time = models.TimeField(default='18:00')
    
    def __str__(self):
        return f"Dr. {self.user.get_full_name() or self.user.username}"
