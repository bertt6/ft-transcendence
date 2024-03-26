# Generated by Django 5.0.3 on 2024-03-19 11:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Profile', '0011_merge_20240318_1849'),
        ('Tournament', '0006_tournament_created_by'),
    ]

    operations = [
        migrations.AddField(
            model_name='tournament',
            name='current_participants',
            field=models.ManyToManyField(related_name='current_participants', to='Profile.profile'),
        ),
        migrations.AlterField(
            model_name='tournament',
            name='name',
            field=models.CharField(max_length=100, unique=True),
        ),
    ]