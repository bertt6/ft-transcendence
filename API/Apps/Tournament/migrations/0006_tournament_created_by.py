# Generated by Django 5.0.3 on 2024-03-19 10:42

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Profile', '0011_merge_20240318_1849'),
        ('Tournament', '0005_remove_tournament_created_by_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='tournament',
            name='created_by',
            field=models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='Profile.profile'),
        ),
    ]