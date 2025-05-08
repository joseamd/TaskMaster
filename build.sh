#!/usr/bin/env bash
# Exit on error
set -o errexit

# 1. Build el frontend con Vite
cd frontend
npm install
npm run build
cd ..

# 2. Instalar dependencias Python
cd backend
pip install -r ../requirements.txt

# 3. Recolectar archivos estáticos y migraciones
python manage.py collectstatic --no-input
python manage.py migrate

if [[ $CREATE_SUPERUSER ]]
then
    python manage.py createsuperuser --no-input
fi