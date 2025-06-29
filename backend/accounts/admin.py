from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Patient, Therapist

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_active')
    list_filter = ('role', 'is_active', 'is_staff')
    fieldsets = UserAdmin.fieldsets + (
        ('Información Adicional', {'fields': ('role', 'phone', 'date_of_birth')}),
    )

@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('user', 'initial_test_completed', 'anxiety_level', 'depression_level')
    list_filter = ('initial_test_completed', 'previous_therapy')

@admin.register(Therapist)
class TherapistAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialty', 'license_number', 'years_experience', 'is_available')
    list_filter = ('specialty', 'is_available')
