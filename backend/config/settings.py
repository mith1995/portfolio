import mimetypes
import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent


def env_list(name, default=""):
    """'a, b,c' -> ['a', 'b', 'c'] (empty items dropped)."""
    return [item.strip() for item in os.environ.get(name, default).split(",") if item.strip()]


# --- Basic ---------------------------------------------------------------
# Render sets RENDER=true by itself, so DEBUG is OFF there unless you override it.
# Locally (no RENDER variable) DEBUG stays ON, so nothing changes for development.
ON_RENDER = bool(os.environ.get("RENDER"))
DEBUG = os.environ.get("DJANGO_DEBUG", "0" if ON_RENDER else "1") == "1"

SECRET_KEY = os.environ.get("DJANGO_SECRET_KEY", "dev-only-change-me")
if not DEBUG and SECRET_KEY == "dev-only-change-me":
    raise RuntimeError("Set the DJANGO_SECRET_KEY environment variable when DEBUG is off.")

ALLOWED_HOSTS = env_list("DJANGO_ALLOWED_HOSTS", "localhost,127.0.0.1")
CSRF_TRUSTED_ORIGINS = env_list("CSRF_TRUSTED_ORIGINS")

# Render gives every service a *.onrender.com hostname and exposes it here.
RENDER_HOST = os.environ.get("RENDER_EXTERNAL_HOSTNAME")
if RENDER_HOST:
    ALLOWED_HOSTS.append(RENDER_HOST)
    CSRF_TRUSTED_ORIGINS.append(f"https://{RENDER_HOST}")  # needed for admin login over https

INSTALLED_APPS = [
    "unfold",  # Unfold admin theme: must be ABOVE django.contrib.admin
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    # third party
    "rest_framework",
    "corsheaders",
    # local apps
    "apps.profiles",
    "apps.projects",
    "apps.contact",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",  # must be above CommonMiddleware
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

if not DEBUG:
    # With DEBUG off Django no longer serves static files (admin + Unfold CSS/JS).
    # WhiteNoise serves them straight from the app. Must sit right after SecurityMiddleware.
    MIDDLEWARE.insert(2, "whitenoise.middleware.WhiteNoiseMiddleware")

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"

# --- Database ------------------------------------------------------------
# DATABASE_URL set (Neon / Supabase / any Postgres)  -> use it.
# Not set (local development)                        -> SQLite file, as before.
if os.environ.get("DATABASE_URL"):
    import dj_database_url

    DATABASES = {"default": dj_database_url.config(conn_max_age=600)}
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.sqlite3",
            "NAME": BASE_DIR / "db.sqlite3",
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Asia/Kolkata"
USE_I18N = True
USE_TZ = True

# --- Static & media ------------------------------------------------------
STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"  # local development only

# Some systems do not know .vtt; browsers want subtitle files as text/vtt.
mimetypes.add_type("text/vtt", ".vtt")

STORAGES = {
    "default": {"BACKEND": "django.core.files.storage.FileSystemStorage"},
    "staticfiles": {"BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage"},
}

if not DEBUG:
    # "Compressed" without the "Manifest" variant: simpler and cannot fail on a missing file.
    STORAGES["staticfiles"] = {"BACKEND": "whitenoise.storage.CompressedStaticFilesStorage"}

# Uploaded files (photo, resume, videos, .vtt) -> S3-compatible bucket.
# Render's disk is wiped on every restart, so production MUST use this.
# Works with Supabase Storage, Cloudflare R2, AWS S3 ... only the variables change.
if os.environ.get("STORAGE_BUCKET_NAME"):
    from botocore.config import Config

    STORAGES["default"] = {"BACKEND": "storages.backends.s3.S3Storage"}

    AWS_STORAGE_BUCKET_NAME = os.environ["STORAGE_BUCKET_NAME"]
    AWS_S3_ENDPOINT_URL = os.environ["STORAGE_ENDPOINT_URL"]
    AWS_S3_REGION_NAME = os.environ.get("STORAGE_REGION", "us-east-1")
    AWS_ACCESS_KEY_ID = os.environ["STORAGE_ACCESS_KEY_ID"]
    AWS_SECRET_ACCESS_KEY = os.environ["STORAGE_SECRET_ACCESS_KEY"]
    # Public base address of the bucket, WITHOUT https:// (Supabase example in .env.example)
    AWS_S3_CUSTOM_DOMAIN = os.environ.get("STORAGE_PUBLIC_DOMAIN") or None

    AWS_QUERYSTRING_AUTH = False  # plain public URLs, no expiring signatures
    AWS_S3_FILE_OVERWRITE = False  # same filename twice -> new name, never overwrite
    AWS_DEFAULT_ACL = None
    AWS_S3_ADDRESSING_STYLE = "path"
    AWS_S3_SIGNATURE_VERSION = "s3v4"
    AWS_S3_OBJECT_PARAMETERS = {"CacheControl": "public, max-age=86400"}
    # Newer boto3 adds extra checksum headers that some S3-compatible services reject.
    AWS_S3_CLIENT_CONFIG = Config(
        request_checksum_calculation="when_required",
        response_checksum_validation="when_required",
    )

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Allow big video uploads through the admin (value in bytes). Files above
# FILE_UPLOAD_MAX_MEMORY_SIZE are streamed to a temp file instead of RAM.
FILE_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024
DATA_UPLOAD_MAX_MEMORY_SIZE = 5 * 1024 * 1024  # does not limit file parts

# --- HTTPS behind Render's proxy -----------------------------------------
if not DEBUG:
    # Render terminates HTTPS and forwards plain HTTP to Django. Without this header
    # Django thinks every request is http:// and builds http:// media URLs, which the
    # https:// frontend then blocks (mixed content).
    SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True

# --- CORS (React site talks to Django) -----------------------------------
# Production: set CORS_ALLOWED_ORIGINS=https://your-site.vercel.app (no trailing slash)
CORS_ALLOWED_ORIGINS = env_list(
    "CORS_ALLOWED_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
)

# --- Unfold admin theme --------------------------------------------------
UNFOLD = {
    "SITE_TITLE": "Portfolio Admin",
    "SITE_HEADER": "Portfolio Admin",
}

# --- DRF -----------------------------------------------------------------
REST_FRAMEWORK = {
    "DEFAULT_PERMISSION_CLASSES": ["rest_framework.permissions.AllowAny"],
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_THROTTLE_RATES": {"contact": "5/hour"},
}