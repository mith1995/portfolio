# Portfolio: Django + React

Django REST API (Unfold admin panel, multi-language video uploads) and a React + Tailwind frontend.
Theme taken from your HTML/Tailwind portfolio.

```
portfolio/
├── backend/    Django + DRF + Unfold admin   (apps: profiles, projects, contact)
├── frontend/   React + Vite + Tailwind
└── sample_subtitles/   example .vtt files (format reference)
```

## 1. Run the backend (port 8000)

```bash
cd backend
python -m venv venv
venv\Scripts\activate            # Windows   (Mac/Linux: source venv/bin/activate)
pip install -r requirements.txt

python manage.py makemigrations profiles projects contact
python manage.py migrate
python manage.py seed_demo       # optional starter data, edit it in admin afterwards
python manage.py createsuperuser
python manage.py runserver
```

Admin panel (Unfold theme): http://localhost:8000/admin/

### If you already ran an older version of this project
The video fields moved from `Project` to a new `ProjectVideo` model. Run again:
```bash
python manage.py makemigrations projects
python manage.py migrate
```
(Old single video/subtitle fields were empty, so nothing is lost. If migrate complains, delete `db.sqlite3`
and the `migrations/` folders inside each app except `__init__.py`, then run section 1 from `makemigrations`.)

## 2. Run the frontend (port 5173)

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## 3. Fill your content (admin panel)

| Where in admin | What it controls |
|---|---|
| Profiles > Profile | name, headline, intro, photo, resume PDF, email, links, About text, Experience entries, About cards |
| Skill groups | Skills section (add skills inline) |
| Projects > Projects | project cards + detail pages + videos |
| Contact messages | messages from the Hire Me / Contact form |

Only ONE profile can exist. "One line per ..." fields turn each line into a bullet/slide.

## 4. Add a project with videos in several languages

You record the walkthrough once per language (e.g. one in English, one in Hindi). Visitors click a
language button and the whole video (and your voice) switches to that language.

1. Admin > Projects > Add project. Fill title (slug auto-fills), category, descriptions, tech stack (comma separated).
2. Add key features in the inline rows.
3. In **Walkthrough videos**, add one block per language: choose the language, upload that language's `.mp4`/`.webm`.
   Click "Add another Walkthrough video" for the next language.
4. Tick **Is published** and save. It appears on the homepage and at `/projects/<slug>`.

Language buttons appear only when a project has 2 or more videos. Switching keeps the playback position
(as a percentage of the video, because two recordings are rarely the same length).

### Optional subtitles
Each video can also have its own `.vtt` file (text of what you say in THAT video). Visitors get a
"Subtitles: On/Off" button. They are off by default.
1. Compress the video: `ffmpeg -i input.mp4 -vf scale=-2:720 -c:v libx264 -crf 28 -c:a aac -b:a 96k output.mp4`
2. Make text with timestamps using Whisper: `pip install openai-whisper`, then
   `whisper output.mp4 --model small --language hi --output_format vtt` (use `en` for English)
3. Read it and fix mistakes (project and technology names especially).
4. The file must start with the line `WEBVTT`. See `sample_subtitles/`. `.srt` will not work in browsers.

### Adding another language (e.g. Marathi)
Open `backend/apps/projects/models.py`, add a line to `LANGUAGE_CHOICES`, e.g. `("mr", "मराठी")`, then run
`python manage.py makemigrations projects` and `python manage.py migrate`.

## Important notes

- **Media in development** is served by Django with HTTP Range support (so video seeking works).
- **Production**: serve `/media/` with Nginx or cloud storage (Cloudinary / S3 / R2). Hosts like Render/Railway delete local files on restart, so uploaded videos would disappear.
  Set `DJANGO_DEBUG=0`, `DJANGO_SECRET_KEY`, `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS` (your frontend URL) as environment variables, and switch the database to PostgreSQL.
- Several videos per project means more storage and bandwidth. Keep each video compressed.
- **Frontend API URL**: copy `frontend/.env.example` to `.env` and set `VITE_API_URL` to your deployed backend.
- Subtitles load from the Django origin, so the `<video crossOrigin="anonymous">` attribute and CORS headers are required (already set).
- Contact form is rate limited to 5 messages/hour per visitor.
- `seed_demo` creates placeholder text (role titles, bullet points, sample project). Review and rewrite everything so it is true and something you can explain in an interview.
