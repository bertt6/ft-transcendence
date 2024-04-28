# Generated by Django 5.0.3 on 2024-04-21 19:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Game', '0002_game_tournament'),
        ('Tournament', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='round',
            name='matches',
            field=models.ManyToManyField(blank=True, related_name='game', to='Game.game'),
        ),
    ]