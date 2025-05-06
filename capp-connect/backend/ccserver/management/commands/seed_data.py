from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from ccserver.models import Tag, Profile, ProfileTag, Post, PostTag
from faker import Faker
import random

fake = Faker()

class Command(BaseCommand):
    help = "Seed the database with fake users, profiles, tags, and posts"

    def handle(self, *args, **kwargs):
        self.stdout.write("Seeding data...")
        self.create_tags()
        users = self.create_users_and_profiles(10)
        self.create_posts(users, 20)
        self.stdout.write(self.style.SUCCESS("Seeding complete!"))

    def create_tags(self):
        tag_names = ["Python", "Django", "React", "AWS", "SQL", "Machine Learning", "UI/UX", "NLP"]
        for name in tag_names:
            Tag.objects.get_or_create(tag_name=name)

    def create_users_and_profiles(self, num_users):
        users = []
        tags = list(Tag.objects.all())
        for _ in range(num_users):
            user = User.objects.create_user(
                username=fake.user_name(),
                email=fake.email(),
                password="testpass123"
            )
            profile = Profile.objects.create(
                user=user,
                slack_username=fake.user_name(),
                linkedin_username=fake.user_name(),
                github_username=fake.user_name(),
                personal_site=fake.url(),
                country=fake.country(),
                state=fake.state(),
                city=fake.city(),
                phone_number=fake.phone_number(),
                photo_url=fake.image_url(),
                employment_status=random.choice([choice[0] for choice in Profile._meta.get_field('employment_status').choices]),
                job_title=fake.job(),
                company=fake.company(),
                bio=fake.text(max_nb_chars=200)
            )
            selected_tags = random.sample(tags, k=random.randint(1, 3))
            for tag in selected_tags:
                ProfileTag.objects.get_or_create(user=user, tag=tag)
            users.append(user)
        return users

    def create_posts(self, users, num_posts):
        tags = list(Tag.objects.all())
        for _ in range(num_posts):
            user = random.choice(users)
            post = Post.objects.create(
                user=user,
                title=fake.sentence(nb_words=6),
                description=fake.text(),
                post_type=random.choice([choice[0] for choice in Post._meta.get_field('post_type').choices]),
                links=fake.url()
            )
            selected_tags = random.sample(tags, k=random.randint(1, 3))
            for tag in selected_tags:
                PostTag.objects.get_or_create(post=post, tag=tag)
