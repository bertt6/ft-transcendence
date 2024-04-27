# Generated by Django 5.0.3 on 2024-04-20 22:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('Game', '__first__'),
        ('Profile', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Round',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('round_number', models.PositiveIntegerField()),
                ('matches', models.ManyToManyField(blank=True, related_name='rounds', to='Game.game')),
                ('participants', models.ManyToManyField(related_name='round_participants', to='Profile.profile')),
            ],
        ),
        migrations.CreateModel(
            name='Tournament',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, unique=True)),
                ('max_participants', models.IntegerField()),
                ('is_started', models.BooleanField(default=False)),
                ('is_finished', models.BooleanField(default=False)),
                ('created_by', models.ForeignKey(default=None, on_delete=django.db.models.deletion.CASCADE, to='Profile.profile')),
                ('current_participants', models.ManyToManyField(related_name='current_participants', to='Profile.profile')),
                ('rounds', models.ManyToManyField(blank=True, related_name='Rounds', to='Tournament.round')),
                ('winner', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='won_tournaments', to='Profile.profile')),
            ],
        ),
    ]
