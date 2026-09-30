from django.contrib import admin
from .models import Candidate, Application
from django.utils.html import format_html

class ApplicationInline(admin.TabularInline):
    model = Application
    extra = 0
    fields = ('company_name', 'role_applied', 'application_type', 'status', 'applied_date')
    readonly_fields = ('applied_date',)

@admin.register(Candidate)
class CandidateAdmin(admin.ModelAdmin):
    list_display = ('full_name', 'target_role', 'selected_plan', 'status', 'applications_sent', 'cold_pitches_sent', 'interviews_received', 'created_at')
    list_filter = ('status', 'selected_plan', 'created_at')
    search_fields = ('full_name', 'email', 'whatsapp_number', 'target_role')
    inlines = [ApplicationInline]
    
    fieldsets = (
        ('Personal Info', {
            'fields': ('user', 'full_name', 'email', 'whatsapp_number', 'current_location')
        }),
        ('Professional Info', {
            'fields': ('target_role', 'secondary_role', 'experience_years')
        }),
        ('Education', {
            'fields': ('college', 'degree', 'graduation_year')
        }),
        ('Financials', {
            'fields': ('current_ctc', 'expected_ctc', 'notice_period')
        }),
        ('Profiles & Resume', {
            'fields': ('linkedin_url', 'github_url', 'portfolio_url', 'resume')
        }),
        ('Plan & Status', {
            'fields': ('selected_plan', 'status')
        }),
        ('Dedicated Email', {
            'fields': ('dedicated_email', 'dedicated_email_password')
        }),
        ('📊 Tracking Counters (Update These!)', {
            'fields': ('applications_sent', 'cold_pitches_sent', 'interviews_received'),
            'description': 'Update these numbers as you submit applications and receive interview calls for this candidate.',
        }),
    )

@admin.register(Application)
class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('company_name', 'candidate', 'role_applied', 'application_type', 'status', 'applied_date')
    list_filter = ('status', 'application_type', 'applied_date')
    search_fields = ('company_name', 'role_applied', 'candidate__full_name')
