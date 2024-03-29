# Generated by Django 5.0.3 on 2024-03-13 13:12

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Stats',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_games', models.IntegerField()),
                ('total_wins', models.IntegerField()),
                ('total_losses', models.IntegerField()),
                ('points', models.IntegerField()),
            ],
        ),
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nickname', models.CharField(max_length=100)),
                ('is_online', models.BooleanField(default=False)),
                ('friends', models.ManyToManyField(blank=True, to='Profile.profile')),
                ('user', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('stats', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, to='Profile.stats')),
            ],
        ),
    ]
