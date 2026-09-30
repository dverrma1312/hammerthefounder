from rest_framework import serializers
from .models import Candidate, Application

class ApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = '__all__'

class CandidateSerializer(serializers.ModelSerializer):
    applications = ApplicationSerializer(many=True, read_only=True)
    selected_plan_display = serializers.CharField(source='get_selected_plan_display', read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    
    class Meta:
        model = Candidate
        fields = [
            'id', 'full_name', 'email', 'whatsapp_number', 'current_location',
            'target_role', 'secondary_role', 'experience_years',
            'college', 'degree', 'graduation_year',
            'current_ctc', 'expected_ctc', 'notice_period',
            'linkedin_url', 'github_url', 'portfolio_url', 'resume',
            'selected_plan', 'selected_plan_display', 'status', 'status_display',
            'dedicated_email', 'dedicated_email_password',
            'applications_sent', 'cold_pitches_sent', 'interviews_received',
            'applications', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'dedicated_email', 'dedicated_email_password', 'applications_sent', 'cold_pitches_sent', 'interviews_received', 'applications', 'created_at', 'updated_at']

class CandidateRegistrationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Candidate
        fields = [
            'full_name', 'email', 'whatsapp_number', 'current_location',
            'target_role', 'secondary_role', 'experience_years',
            'college', 'degree', 'graduation_year',
            'current_ctc', 'expected_ctc', 'notice_period',
            'linkedin_url', 'github_url', 'portfolio_url', 'resume',
            'selected_plan'
        ]
