# Generated by Django 5.0.3 on 2024-03-21 17:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Profile', '0003_profile_bio'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='bio',
            field=models.TextField(blank=True, default=None, null=True),
        ),
    ]
