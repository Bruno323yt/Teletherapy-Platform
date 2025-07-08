from django.urls import path
from . import views

urlpatterns = [
    path('', views.SessionListCreateView.as_view(), name='session-list-create'),
    path('<uuid:pk>/', views.SessionDetailView.as_view(), name='session-detail'),
    path('<uuid:session_id>/confirm/', views.confirm_session, name='confirm-session'),
    path('<uuid:session_id>/cancel/', views.cancel_session, name='cancel-session'),
    path('<uuid:session_id>/start/', views.start_session, name='start-session'),
    path('<uuid:session_id>/messages/', views.SessionMessagesView.as_view(), name='session-messages'),
    path('patient/', views.PatientSessionsView.as_view(), name='patient-sessions'),
    path('therapist/', views.TherapistSessionsView.as_view(), name='therapist-sessions'),
    path('therapist/<int:therapist_id>/availability/', views.therapist_availability, name='therapist-availability'),
]
