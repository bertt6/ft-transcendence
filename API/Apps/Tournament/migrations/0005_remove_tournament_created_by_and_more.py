# Generated by Django 5.0.3 on 2024-03-18 19:23

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Tournament', '0004_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tournament',
            name='created_by',
        ),
        migrations.RemoveField(
            model_name='tournament',
            name='current_participants',
        ),
    ]
