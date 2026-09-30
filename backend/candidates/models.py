from django.db import models
from django.contrib.auth.models import User
import uuid

class Candidate(models.Model):
    PLAN_CHOICES = [
        ('normal', 'Normal Apply'),
        ('cold', 'Cold Apply'),
        ('both', 'Full-Throttle Sprint'),
        ('budget', 'Budget-Friendly / Custom'),
    ]
    STATUS_CHOICES = [
        ('registered', 'Registered'),
        ('whatsapp_connected', 'WhatsApp Connected'),
        ('active', 'Active Campaign'),
        ('paused', 'Paused'),
        ('completed', 'Completed'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)
    
    # Personal
    full_name = models.CharField(max_length=200)
    email = models.EmailField()
    whatsapp_number = models.CharField(max_length=20)
    current_location = models.CharField(max_length=200, blank=True)
    
    # Professional
    target_role = models.CharField(max_length=200)
    secondary_role = models.CharField(max_length=200, blank=True)
    experience_years = models.DecimalField(max_digits=4, decimal_places=1, default=0)
    
    # Education
    college = models.CharField(max_length=300, blank=True)
    degree = models.CharField(max_length=200, blank=True)
    graduation_year = models.IntegerField(null=True, blank=True)
    
    # Financials
    current_ctc = models.CharField(max_length=100, blank=True, help_text="e.g., 4 LPA or $60k")
    expected_ctc = models.CharField(max_length=100, blank=True, help_text="e.g., 8 LPA or $80k")
    notice_period = models.CharField(max_length=100, blank=True)
    
    # Profiles & Resume
    linkedin_url = models.URLField(blank=True)
    github_url = models.URLField(blank=True)
    portfolio_url = models.URLField(blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True)
    
    # Plan & Status
    selected_plan = models.CharField(max_length=20, choices=PLAN_CHOICES)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='registered')
    
    # Dedicated Email (set by admin)
    dedicated_email = models.EmailField(blank=True, help_text="Dedicated career email created for this candidate")
    dedicated_email_password = models.CharField(max_length=200, blank=True)
    
    # Tracking Counters (updated by admin)
    applications_sent = models.IntegerField(default=0)
    cold_pitches_sent = models.IntegerField(default=0)
    interviews_received = models.IntegerField(default=0)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-created_at']
    
    def __str__(self):
        return f"{self.full_name} — {self.target_role} ({self.get_selected_plan_display()})"


class Application(models.Model):
    TYPE_CHOICES = [
        ('normal', 'Normal (ATS/Portal)'),
        ('cold', 'Cold Pitch (Direct Outreach)'),
    ]
    STATUS_CHOICES = [
        ('applied', 'Applied'),
        ('under_review', 'Under Review'),
        ('interview', 'Interview Scheduled 🎉'),
        ('rejected', 'Rejected'),
        ('offer', 'Offer Received 🏆'),
    ]
    
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    candidate = models.ForeignKey(Candidate, on_delete=models.CASCADE, related_name='applications')
    
    company_name = models.CharField(max_length=300)
    role_applied = models.CharField(max_length=300)
    application_type = models.CharField(max_length=10, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='applied')
    
    applied_date = models.DateField(auto_now_add=True)
    notes = models.TextField(blank=True)
    
    class Meta:
        ordering = ['-applied_date']
    
    def __str__(self):
        return f"{self.company_name} — {self.role_applied} ({self.get_status_display()})"
