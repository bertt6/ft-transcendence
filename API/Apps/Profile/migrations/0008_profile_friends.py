# Generated by Django 5.0.3 on 2024-03-17 21:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Profile', '0007_profile_user'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='friends',
            field=models.ManyToManyField(blank=True, to='Profile.profile'),
        ),
    ]
