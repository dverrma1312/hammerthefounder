#!/bin/bash
echo "Setting up HammerTheFounder backend..."

python3 -m venv .venv
source .venv/bin/activate
pip install django djangorestframework django-cors-headers Pillow python-dotenv itsdangerous django-ratelimit
pip freeze > requirements.txt

python manage.py makemigrations
python manage.py migrate

echo "Creating superuser..."
python manage.py createsuperuser

echo "Setup complete! Run 'python manage.py runserver' to start."
