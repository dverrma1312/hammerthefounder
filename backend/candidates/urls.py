from django.urls import path
from . import views

urlpatterns = [
    path('register/', views.register_candidate, name='register'),
    path('whatsapp-redirect/<str:token>/', views.whatsapp_redirect, name='whatsapp-redirect'),
    path('<uuid:pk>/dashboard/', views.candidate_dashboard, name='dashboard'),
]
