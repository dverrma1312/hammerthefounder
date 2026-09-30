# ⚡ HammerTheFounder

> **Stop Sending 300+ Applications Into The Void. We Apply & Pitch Startup Founders For You.**

A full-stack, white-glove job application platform built for students and new grads facing the entry-level hiring crisis.

---

## 🎨 Design System & Philosophy

Inspired by [bleibtgleich.dev](https://bleibtgleich.dev/):
- **Typography-first**: Bold grotesque headings (`Space Grotesk`), clean body text (`Inter`), and monospaced technical metadata (`JetBrains Mono`).
- **Monochrome & High-contrast**: Deep black `#0a0a0a` background with `#f5f5f0` high-legibility text and a single purposeful burnt-orange accent `#c45a3c`.
- **Zero "Vibecoding"**: No generic glassmorphism, rainbow gradients, or SaaS boilerplate fluff. Clean grid lines and intentional whitespace.
- **Embedded Anthem**: Floating music player widget with audio waveform visualization configured for *"Hum leke rahenge azadi kuch bhi krlo azadi"*.

---

## 🔒 Security Architecture (WhatsApp Concierge)

The user is redirected to your WhatsApp **without ever exposing your phone number to client-side code**:

1. **Intake Submission**: Candidate uploads resume and details to `POST /api/candidates/register/`.
2. **Cryptographically Signed Token**: The Django backend issues an encrypted, time-limited token via `itsdangerous.URLSafeTimedSerializer` (valid for 10 minutes only).
3. **Server-Side Redirect**: The client opens `/api/candidates/whatsapp-redirect/<token>/`. The backend validates the signature, marks the candidate as `whatsapp_connected`, retrieves your secret phone number from environment variables, and sends a `302 Found` redirect straight to `https://wa.me/<number>?text=...`.
4. **Brute-Force & Rate Limiting**: The redirect endpoint is locked with `django-ratelimit` (5 requests/minute per IP).

---

## 🚀 Quick Start Guide

### 1. Backend (Django + Django REST Framework)

```bash
cd /Users/harshit/Downloads/hammerthefounder/backend

# Run the automated setup script
./setup.sh
```

Or manually:
```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

* API runs on: `http://localhost:8000`
* Admin panel: `http://localhost:8000/admin` (Log in with your superuser credentials)

#### Environment Configuration (`backend/.env`)
```ini
SECRET_KEY=your_secret_key
DEBUG=True
WHATSAPP_NUMBER=919876543210     # Replace with your actual WhatsApp phone number with country code
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

---

### 2. Frontend (React + Vite + Tailwind CSS)

```bash
cd /Users/harshit/Downloads/hammerthefounder/frontend

npm install
npm run dev
```

* Frontend runs on: `http://localhost:5173`

---

### 3. Adding the Anthem Audio File

Place your audio file at:
```
frontend/public/audio/anthem.mp3
```
The music widget on the bottom-right will automatically play/pause and display the waveform animation.

---

## 📊 Admin Workflow (How You Manage Candidates)

1. Open `http://localhost:8000/admin/candidates/candidate/`.
2. View incoming candidate registrations, download their uploaded resume PDF, and inspect expected CTC & role preferences.
3. Once you discuss on WhatsApp and create their dedicated email, input:
   - **Dedicated Email** (e.g., `candidate.career@domain.com`)
   - **Passkey**
4. Update the **Tracking Counters**:
   - `Applications Sent`
   - `Cold Pitches Sent`
   - `Interviews Received`
5. In the **Applications Inline Table**, add companies you applied to (`Company`, `Role`, `Normal vs Cold`, `Status: Applied / Interview / Offer`).
6. The candidate visits `http://localhost:5173/dashboard?id=<CANDIDATE_UUID>` and sees their live status updated in real-time!
