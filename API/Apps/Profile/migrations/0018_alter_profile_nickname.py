# Generated by Django 5.0.3 on 2024-04-03 10:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Profile', '0017_alter_profile_profile_picture'),
    ]

    operations = [
        migrations.AlterField(
            model_name='profile',
            name='nickname',
            field=models.CharField(blank=True, default=None, max_length=100, null=True, unique=True),
        ),
    ]
