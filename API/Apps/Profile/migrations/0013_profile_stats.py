# Generated by Django 5.0.3 on 2024-03-26 17:36

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Profile', '0012_merge_0005_alter_profile_bio_0011_merge_20240318_1849'),
    ]

    operations = [
        migrations.AddField(
            model_name='profile',
            name='stats',
            field=models.OneToOneField(null=True, on_delete=django.db.models.deletion.CASCADE, to='Profile.stats'),
        ),
    ]
