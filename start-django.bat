@echo off
cd /d "C:\Users\kavee\Documents\Programming\CompanyWebsite\luxury-agency\luxury-agency-backend"
call venv\Scripts\activate.bat
python manage.py runserver 8000
pause
