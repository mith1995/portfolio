#!/usr/bin/env bash
# Render runs this on every deploy:  Build Command = bash build.sh
# Stop at the first error, so a broken build never goes live.
set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --no-input
python manage.py migrate --no-input

# Free Render has no shell, so the admin user is created from environment variables.
# Needs DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_EMAIL, DJANGO_SUPERUSER_PASSWORD.
# If the user already exists the command fails harmlessly ("|| true").
if [[ -n "${DJANGO_SUPERUSER_USERNAME:-}" ]]; then
  python manage.py createsuperuser --no-input || true
fi