from django.core.management.base import BaseCommand
from django.contrib.auth.models import User, Group
from workshop_app.models import Profile, WorkshopType, Workshop, title, department_choices, position_choices, states
from teams.models import Team
from faker import Faker
import random
import datetime
from django.utils import timezone

class Command(BaseCommand):
    help = 'Generates dummy data for the FOSSEE Workshop Booking app for testing purposes.'

    def handle(self, *args, **options):
        fake = Faker('en_IN')
        self.stdout.write("Deleting old dummy data (preserving admin)...")
        # Ensure we don't delete superusers or real hardcoded accounts if we want to be safe,
        # but for testing, we can wipe regular users.
        User.objects.filter(is_superuser=False, is_staff=False).delete()
        WorkshopType.objects.all().delete()
        Team.objects.all().delete()
        
        # Ensure groups exist
        Team.objects.filter().delete() # Clean up teams
        inst_group, _ = Group.objects.get_or_create(name='instructor')
        coord_group, _ = Group.objects.get_or_create(name='coordinator')

        self.stdout.write("Generating Workshop Types...")
        workshop_types = []
        templates = [
            ("Python for Data Science", 3),
            ("Scilab Basic Workshop", 1),
            ("R Programming Bootcamp", 2),
            ("OpenFOAM Advanced Lab", 5),
            ("Arduino & IoT Systems", 2),
            ("Linux Systems & Git", 1)
        ]
        text_faker = Faker('en_US') # English generic for dev descriptions
        for name, duration in templates:
            wt = WorkshopType.objects.create(
                name=name,
                description=text_faker.paragraph(nb_sentences=3),
                duration=duration,
                terms_and_conditions="1. Must have laptops.\\n2. Internet connection required."
            )
            workshop_types.append(wt)

        self.stdout.write("Generating Users & Profiles...")
        instructors = []
        coordinators = []
        
        # Generate 5 Instructors
        for _ in range(5):
            fname = fake.first_name()
            lname = fake.last_name()
            username = f"inst_{fname.lower()}_{random.randint(100,999)}"
            user = User.objects.create_user(username=username, email=fake.email(), password="password123")
            user.first_name = fname
            user.last_name = lname
            user.save()
            user.groups.add(inst_group)
            
            Profile.objects.create(
                user=user,
                title=random.choice(title)[0],
                institute="IIT Bombay",
                department=random.choice(department_choices)[0],
                phone_number=str(fake.random_number(digits=10, fix_len=True)),
                position='instructor',
                state=random.choice(states)[0],
                is_email_verified=True
            )
            instructors.append(user)

        # Generate 20 Coordinators
        for _ in range(20):
            fname = fake.first_name()
            lname = fake.last_name()
            username = f"coord_{fname.lower()}_{random.randint(100,999)}"
            user = User.objects.create_user(username=username, email=fake.email(), password="password123")
            user.first_name = fname
            user.last_name = lname
            user.save()
            user.groups.add(coord_group)
            
            Profile.objects.create(
                user=user,
                title=random.choice(title)[0],
                institute=f"{fake.city()} Institute of Technology",
                department=random.choice(department_choices)[0],
                phone_number=str(fake.random_number(digits=10, fix_len=True)),
                position='coordinator',
                state=random.choice(states)[0] if random.choice(states)[0] else "IN-MH",
                is_email_verified=True
            )
            coordinators.append(user)

        self.stdout.write("Generating Teams...")
        team1 = Team.objects.create(creator=instructors[0])
        team2 = Team.objects.create(creator=instructors[1])
        # Assign members to team 1
        for inst in instructors[0:3]:
            team1.members.add(inst.profile)
        # Assign members to team 2
        for inst in instructors[3:5]:
            team2.members.add(inst.profile)

        self.stdout.write("Generating Workshops...")
        today = timezone.now().date()
        for _ in range(100):
            # random date between 30 days ago and 60 days ahead
            offset_days = random.randint(-30, 60)
            target_date = today + datetime.timedelta(days=offset_days)
            coord = random.choice(coordinators)
            wt = random.choice(workshop_types)
            
            # Status: 0=Pending, 1=Accepted, 2=Deleted. We want mostly Accepted or Pending currently.
            # Past dates usually Accepted. Future dates can be Pending or Accepted.
            if target_date < today: # Past workshops
                status = random.choices([1, 2], weights=[90, 10])[0]
            else: # Future workshops
                status = random.choices([0, 1, 2], weights=[40, 50, 10])[0]
            
            instructor = random.choice(instructors) if status != 0 else None
            
            Workshop.objects.create(
                coordinator=coord,
                instructor=instructor,
                workshop_type=wt,
                date=target_date,
                status=status,
                tnc_accepted=True
            )

        self.stdout.write(self.style.SUCCESS("Successfully generated FOSSEE dummy data!"))
