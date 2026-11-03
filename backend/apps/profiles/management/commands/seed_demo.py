"""python manage.py seed_demo

Fills the database with a first draft of your profile, skills, experience and
one sample project, so the site is not empty on day one. Safe to run twice
(it only creates what is missing). EDIT EVERYTHING in /admin/ afterwards -
role titles, bullet points and the sample project are placeholders to review.
"""

from django.core.management.base import BaseCommand

from apps.profiles.models import Experience, Highlight, Profile, Skill, SkillGroup
from apps.projects.models import Project, ProjectFeature

SKILLS = {
    "Backend": ["Python", "Django", "Django REST Framework", "PHP", "CodeIgniter"],
    "Frontend": ["React", "Redux", "JavaScript", "HTML", "CSS"],
    "Databases": ["PostgreSQL", "MySQL", "Supabase"],
    "Tools & Integrations": ["Git", "GitHub", "GitLab", "Postman", "Stripe", "Razorpay"],
}

EXPERIENCE = [
    (
        "Software Developer",
        "Narola Infotech",
        "Jul 2022 - Aug 2024",
        "Built features on Tabidoc, Contractor Management and Podcast projects\n"
        "Worked with PHP CodeIgniter on the backend and React on the frontend",
    ),
    (
        "Software Developer",
        "Narola Infotech",
        "Dec 2019 - Dec 2020",
        "Worked on a coupon module, School Management and Inventory projects",
    ),
    (
        "PHP Developer",
        "D&K (DNK Tech)",
        "Jun 2018 - Oct 2019",
        "Built web applications in PHP CodeIgniter (Cubber, Zestmelange)",
    ),
]


class Command(BaseCommand):
    help = "Create starter portfolio data (idempotent)."

    def handle(self, *args, **options):
        profile, created = Profile.objects.get_or_create(
            pk=1,
            defaults=dict(
                full_name="Mithalesh Pal",
                headline="Python Django + React Full Stack Developer",
                intro=(
                    "Web developer with 4.5+ years of experience in PHP CodeIgniter and React, "
                    "now building full-stack products with Django, Django REST Framework and React."
                ),
                availability_text="Open to full-time roles and freelance work",
                focus_points=(
                    "Django REST APIs with clean, tested structure.\n"
                    "React interfaces built for real users.\n"
                    "From PHP and CodeIgniter to Python and Django."
                ),
                about_heading="A developer who ships working products.",
                about_text=(
                    "I started my career in PHP and CodeIgniter and worked on React frontends "
                    "at Narola Infotech. I am now focused on Python, Django and React, and I "
                    "build full-stack projects end to end: models, APIs, authentication, "
                    "payments and a responsive UI.\n\n"
                    "Edit this text in the admin panel and describe your own journey."
                ),
                experience_label="4.5+ yrs",
                open_to="Full-time roles\nFreelance projects\nRemote / hybrid work",
                email="",
                location="Surat, Gujarat, India",
            ),
        )

        if created:
            Highlight.objects.bulk_create(
                [
                    Highlight(profile=profile, order=1, title="Backend",
                              text="Python, Django, Django REST Framework, PHP and CodeIgniter."),
                    Highlight(profile=profile, order=2, title="Frontend",
                              text="React, Redux, JavaScript, HTML and CSS."),
                    Highlight(profile=profile, order=3, title="Database",
                              text="PostgreSQL, MySQL and Supabase."),
                    Highlight(profile=profile, order=4, title="Integrations",
                              text="Stripe, Razorpay, Vonage, Blue Dart and Mailchimp."),
                ]
            )
            for i, (role, company, period, desc) in enumerate(EXPERIENCE):
                Experience.objects.create(
                    profile=profile, order=i, role=role, company=company,
                    period=period, description=desc,
                )

        if not SkillGroup.objects.exists():
            for gi, (title, names) in enumerate(SKILLS.items()):
                group = SkillGroup.objects.create(profile=profile, title=title, order=gi)
                Skill.objects.bulk_create(
                    [Skill(group=group, name=n, order=i) for i, n in enumerate(names)]
                )

        project, p_created = Project.objects.get_or_create(
            slug="pizza-hut-food-ordering",
            defaults=dict(
                title="Pizza Hut Food Ordering",
                category="E-commerce / Django REST API",
                short_description="Food ordering backend with addresses, cart-to-order flow, wishlist and reviews.",
                summary=(
                    "A food ordering project built with Django and Django REST Framework. "
                    "Replace this text with your own overview and upload your walkthrough video."
                ),
                challenge="Placeholder: describe the problem this project solves.",
                solution="Placeholder: describe how you solved it.",
                tech_stack="Django, Django REST Framework, REST API",
                is_published=True,
            ),
        )
        if p_created:
            for i, text in enumerate(
                [
                    "User address management API with a per-user limit",
                    "Orders created from the cart (Order and OrderItem models)",
                    "Wishlist for products",
                    "Product reviews and ratings",
                ]
            ):
                ProjectFeature.objects.create(project=project, order=i, text=text)

        self.stdout.write(self.style.SUCCESS("Starter data ready. Now review everything in /admin/."))
