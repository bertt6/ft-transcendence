# Generated by Django 5.0.3 on 2024-03-17 03:34

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Profile', '0002_remove_profile_friends_remove_profile_stats_and_more'),
        ('Tournament', '0003_delete_tournament'),
    ]

    operations = [
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100)),
                ('max_participants', models.IntegerField()),
                ('is_started', models.BooleanField(default=False)),
                ('created_by', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='Profile.profile')),
                ('current_participants', models.ManyToManyField(related_name='current_participants', to='Profile.profile')),
            ],
        ),
    ]