# Generated by Django 5.0.3 on 2024-04-15 16:47

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("Profile", "0019_stats_points"),
    ]

    operations = [
        migrations.AddField(
            model_name="profile",
            name="blocked_users",
            field=models.ManyToManyField(
                blank=True, related_name="users_blocked", to="Profile.profile"
            ),
        ),
        migrations.AlterField(
            model_name="profile",
            name="friends",
            field=models.ManyToManyField(
                blank=True, related_name="profile_friends", to="Profile.profile"
            ),
        ),
    ]
