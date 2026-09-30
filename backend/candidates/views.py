import urllib.parse
from django.conf import settings
from django.core import signing
from django.shortcuts import redirect
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import Candidate
from .serializers import CandidateSerializer, CandidateRegistrationSerializer

try:
    from django_ratelimit.decorators import ratelimit
except ImportError:
    def ratelimit(*args, **kwargs):
        def decorator(fn):
            return fn
        return decorator

@api_view(['POST'])
def register_candidate(request):
    serializer = CandidateRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        candidate = serializer.save()
        
        # Generate a signed token that expires in 10 minutes (600 seconds) using Django's built-in cryptographic signer
        token = signing.dumps(str(candidate.id))
        
        return Response({
            'message': 'Registration successful',
            'token': token,
            'candidate_id': candidate.id
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@ratelimit(key='ip', rate='5/m', block=True)
def whatsapp_redirect(request, token):
    try:
        # Token expires in 10 minutes (600 seconds)
        candidate_id = signing.loads(token, max_age=600)
    except signing.SignatureExpired:
        return Response({'error': 'Token has expired.'}, status=status.HTTP_400_BAD_REQUEST)
    except signing.BadSignature:
        return Response({'error': 'Invalid token.'}, status=status.HTTP_400_BAD_REQUEST)
        
    try:
        candidate = Candidate.objects.get(id=candidate_id)
    except Candidate.DoesNotExist:
        return Response({'error': 'Candidate not found.'}, status=status.HTTP_404_NOT_FOUND)
        
    # Mark status as whatsapp_connected if it was just registered
    if candidate.status == 'registered':
        candidate.status = 'whatsapp_connected'
        candidate.save()
        
    whatsapp_number = getattr(settings, 'WHATSAPP_NUMBER', '')
    if not whatsapp_number:
        return Response({'error': 'WhatsApp number is not configured.'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    message = f"Hi, I just registered on HammerTheFounder! My name is {candidate.full_name} and I opted for the {candidate.get_selected_plan_display()} plan."
    encoded_message = urllib.parse.quote(message)
    
    redirect_url = f"https://wa.me/{whatsapp_number}?text={encoded_message}"
    
    return redirect(redirect_url)

@api_view(['GET'])
def candidate_dashboard(request, pk):
    try:
        candidate = Candidate.objects.get(pk=pk)
    except Candidate.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
        
    serializer = CandidateSerializer(candidate)
    return Response(serializer.data)
