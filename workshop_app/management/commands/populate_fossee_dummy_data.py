import datetime
import random

from django.contrib.auth.models import Group, User
from django.core.management.base import BaseCommand
from django.db import transaction
from django.utils import timezone

from teams.models import Team
from workshop_app.models import (
    Banner,
    Comment,
    Profile,
    Testimonial,
    Workshop,
    WorkshopType,
    department_choices,
    title,
)


class Command(BaseCommand):
    help = "Populate realistic FOSSEE-themed dummy data across the app."

    def add_arguments(self, parser):
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete non-admin generated entities before reseeding.",
        )

    @transaction.atomic
    def handle(self, *args, **options):
        reset = options["reset"]
        rng = random.Random(42)

        if reset:
            self.stdout.write("Resetting generated entities...")
            Comment.objects.all().delete()
            Testimonial.objects.all().delete()
            Banner.objects.all().delete()
            Team.objects.all().delete()
            Workshop.objects.exclude(
                coordinator__username__in=["coordinator", "instructor"]
            ).delete()
            WorkshopType.objects.all().delete()
            Profile.objects.exclude(
                user__username__in=["coordinator", "instructor"]
            ).delete()
            User.objects.filter(is_superuser=False).exclude(
                username__in=["coordinator", "instructor"]
            ).delete()

        inst_group, _ = Group.objects.get_or_create(name="instructor")
        coord_group, _ = Group.objects.get_or_create(name="coordinator")

        instructor_pool = self._ensure_instructors(inst_group)
        coordinator_pool = self._ensure_coordinators(coord_group)
        workshop_types = self._ensure_workshop_types()
        self._ensure_teams(instructor_pool)
        workshops = self._ensure_workshops(
            instructors=instructor_pool,
            coordinators=coordinator_pool,
            workshop_types=workshop_types,
            rng=rng,
        )
        self._ensure_comments(workshops, instructor_pool, coordinator_pool, rng)
        self._ensure_testimonials()
        self._ensure_banners()

        self.stdout.write(self.style.SUCCESS("Dummy data populated successfully."))

    def _ensure_profile(
        self, user, position, institute, department, state_code, phone_number, location
    ):
        Profile.objects.update_or_create(
            user=user,
            defaults={
                "title": random.choice(title)[0],
                "institute": institute,
                "department": department,
                "phone_number": phone_number,
                "position": position,
                "state": state_code,
                "location": location,
                "how_did_you_hear_about_us": "FOSSEE website",
                "is_email_verified": True,
            },
        )

    def _ensure_instructors(self, inst_group):
        instructor_specs = [
            ("instructor", "FOSSEE", "Instructor", "instructor123", "IIT Bombay", "IN-MH"),
            ("fossee_scilab", "Ananya", "Kulkarni", "password123", "IIT Bombay", "IN-MH"),
            ("fossee_openfoam", "Rahul", "Nair", "password123", "NIT Calicut", "IN-KL"),
            ("fossee_python", "Meera", "Shah", "password123", "IIT Delhi", "IN-DL"),
            ("fossee_esim", "Arjun", "Patil", "password123", "COEP Pune", "IN-MH"),
            ("fossee_r", "Nikhil", "Joshi", "password123", "IIT Madras", "IN-TN"),
        ]
        created = []
        department = "computer engineering"
        for username, first_name, last_name, password, institute, state_code in instructor_specs:
            user, _ = User.objects.get_or_create(
                username=username,
                defaults={"first_name": first_name, "last_name": last_name, "email": f"{username}@fossee.in"},
            )
            user.first_name = first_name
            user.last_name = last_name
            user.email = user.email or f"{username}@fossee.in"
            user.set_password(password)
            user.save()
            user.groups.add(inst_group)
            self._ensure_profile(
                user=user,
                position="instructor",
                institute=institute,
                department=department,
                state_code=state_code,
                phone_number=self._phone_from_username(username),
                location="Mumbai" if state_code == "IN-MH" else "Regional Center",
            )
            created.append(user)
        return created

    def _ensure_coordinators(self, coord_group):
        coordinator_specs = [
            ("coordinator", "Campus", "Coordinator", "coordinator123", "FOSSEE Partner College, Mumbai", "IN-MH", "Mumbai"),
            ("coord_delhi", "Priya", "Arora", "password123", "Delhi Institute of Technology", "IN-DL", "Delhi"),
            ("coord_chennai", "Karthik", "Iyer", "password123", "Chennai Engineering College", "IN-TN", "Chennai"),
            ("coord_bengaluru", "Sahana", "Rao", "password123", "Bengaluru School of Engineering", "IN-KA", "Bengaluru"),
            ("coord_hyderabad", "Vikram", "Reddy", "password123", "Hyderabad Technical University", "IN-TG", "Hyderabad"),
            ("coord_kolkata", "Ritika", "Sen", "password123", "Kolkata Institute of Science", "IN-WB", "Kolkata"),
            ("coord_jaipur", "Aman", "Mathur", "password123", "Jaipur College of Engineering", "IN-RJ", "Jaipur"),
            ("coord_kochi", "Neha", "Menon", "password123", "Kochi Institute of Technology", "IN-KL", "Kochi"),
            ("coord_lucknow", "Shreya", "Singh", "password123", "Lucknow Engineering College", "IN-UP", "Lucknow"),
            ("coord_bhopal", "Ankit", "Verma", "password123", "Bhopal Institute of Technology", "IN-MP", "Bhopal"),
        ]
        created = []
        department_options = [d[0] for d in department_choices]
        for idx, spec in enumerate(coordinator_specs, start=1):
            username, first_name, last_name, password, institute, state_code, city = spec
            user, _ = User.objects.get_or_create(
                username=username,
                defaults={"first_name": first_name, "last_name": last_name, "email": f"{username}@example.edu"},
            )
            user.first_name = first_name
            user.last_name = last_name
            user.email = user.email or f"{username}@example.edu"
            user.set_password(password)
            user.save()
            user.groups.add(coord_group)
            self._ensure_profile(
                user=user,
                position="coordinator",
                institute=institute,
                department=department_options[idx % len(department_options)],
                state_code=state_code,
                phone_number=self._phone_from_username(username),
                location=city,
            )
            created.append(user)
        return created

    def _ensure_workshop_types(self):
        workshop_templates = [
            ("Python for Scientific Computing", 2, "NumPy, SciPy, and plotting workflows for teaching labs."),
            ("Scilab and Xcos Foundations", 2, "Hands-on Scilab and Xcos exercises for engineering classrooms."),
            ("OpenFOAM Beginner Workshop", 3, "CFD basics, meshing concepts, and solver interpretation."),
            ("eSim Circuit Design Lab", 2, "Schematic capture, simulation, and PCB workflow with eSim."),
            ("R for Data Analysis", 2, "Data wrangling, visualization, and statistical testing in R."),
            ("Linux and Git for Research Teams", 1, "Version control and shell productivity for student teams."),
        ]
        created = []
        for name, duration, description in workshop_templates:
            wt, _ = WorkshopType.objects.get_or_create(
                name=name,
                defaults={
                    "duration": duration,
                    "description": description,
                    "terms_and_conditions": (
                        "1. Participants must have laptop access.\n"
                        "2. Stable internet is required.\n"
                        "3. Attendance certificate requires completion of sessions."
                    ),
                },
            )
            created.append(wt)
        return created

    def _ensure_teams(self, instructors):
        if len(instructors) < 3:
            return
        Team.objects.get_or_create(creator=instructors[0])
        Team.objects.get_or_create(creator=instructors[1])
        team_one = Team.objects.get(creator=instructors[0])
        team_two = Team.objects.get(creator=instructors[1])
        for user in instructors[:3]:
            team_one.members.add(user.profile)
        for user in instructors[2:]:
            team_two.members.add(user.profile)

    def _ensure_workshops(self, instructors, coordinators, workshop_types, rng):
        today = timezone.now().date()
        target_count = 140
        existing_count = Workshop.objects.count()
        to_create = max(target_count - existing_count, 0)

        statuses = [0, 1, 2]
        status_weights = [30, 60, 10]

        created = list(Workshop.objects.select_related("coordinator", "instructor", "workshop_type"))
        for _ in range(to_create):
            date_offset = rng.randint(-120, 120)
            workshop_date = today + datetime.timedelta(days=date_offset)
            status = rng.choices(statuses, weights=status_weights, k=1)[0]
            coordinator = rng.choice(coordinators)
            instructor = rng.choice(instructors) if status != 0 else None
            wt = rng.choice(workshop_types)

            workshop = Workshop.objects.create(
                coordinator=coordinator,
                instructor=instructor,
                workshop_type=wt,
                date=workshop_date,
                status=status,
                tnc_accepted=True,
            )
            created.append(workshop)
        return created

    def _ensure_comments(self, workshops, instructors, coordinators, rng):
        comment_bank = [
            "The session content was clear and practical.",
            "Students requested an extra Q&A block for assignments.",
            "Please share installation steps one day before the workshop.",
            "Great engagement from participants during the live demo.",
            "Could we add an advanced follow-up session next month?",
            "Lab systems were ready and network connectivity was stable.",
            "The examples mapped well to our semester curriculum.",
            "Attendance was strong; requesting certificate workflow details.",
        ]
        total_comments = Comment.objects.count()
        if total_comments >= 180:
            return
        target = 180 - total_comments
        eligible = [w for w in workshops if w.status in (0, 1)]
        if not eligible:
            return
        for _ in range(target):
            workshop = rng.choice(eligible)
            author_pool = instructors + coordinators
            author = rng.choice(author_pool)
            Comment.objects.create(
                workshop=workshop,
                author=author,
                comment=rng.choice(comment_bank),
                public=rng.choice([True, True, False]),
            )

    def _ensure_testimonials(self):
        testimonial_rows = [
            ("Dr. Seema Iyer", "IIT Bombay", "Computer Science", "Well-structured workshop with useful take-home resources."),
            ("Prof. Akash Gupta", "NIT Trichy", "Mechanical Engineering", "OpenFOAM training helped our students begin CFD projects quickly."),
            ("Ms. Pooja Menon", "Government Engineering College, Thrissur", "Electronics", "eSim lab session was practical and easy to replicate."),
            ("Mr. Harsh Dubey", "Delhi Institute of Technology", "Information Technology", "Python workshop improved confidence in data analysis."),
            ("Dr. Nandita Rao", "BMS College of Engineering", "Electrical Engineering", "Coordination and communication from instructors was excellent."),
            ("Prof. Manoj Patil", "COEP Pune", "Civil Engineering", "Scilab examples were aligned with our classroom problem statements."),
        ]
        existing = set(Testimonial.objects.values_list("name", flat=True))
        for name, institute, department, message in testimonial_rows:
            if name in existing:
                continue
            Testimonial.objects.create(
                name=name,
                institute=institute,
                department=department,
                message=message,
            )

    def _ensure_banners(self):
        Banner.objects.update_or_create(
            title="FOSSEE Workshop Season",
            defaults={
                "active": True,
                "html": (
                    "<div style='padding:12px;background:#0a2540;color:#fff;border-radius:8px;'>"
                    "<strong>FOSSEE IIT Bombay:</strong> New workshop slots for Scilab, eSim, "
                    "OpenFOAM, and Python are now open for partner institutes."
                    "</div>"
                ),
            },
        )
        Banner.objects.update_or_create(
            title="Instructor Collaboration Drive",
            defaults={
                "active": False,
                "html": (
                    "<div style='padding:12px;background:#143d66;color:#fff;border-radius:8px;'>"
                    "Invite co-instructors and build multi-campus workshop teams."
                    "</div>"
                ),
            },
        )

    def _phone_from_username(self, username):
        numeric = "".join(str((ord(c) % 10)) for c in username)
        return (numeric + "9876543210")[:10]
