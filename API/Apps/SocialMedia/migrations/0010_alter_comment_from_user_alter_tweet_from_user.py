# Generated by Django 5.0.3 on 2024-03-26 05:18

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Profile', '0002_profile_is_verified_alter_profile_nickname'),
        ('SocialMedia', '0009_alter_comment_from_user_alter_tweet_from_user'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='from_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='Profile.profile'),
        ),
        migrations.AlterField(
            model_name='tweet',
            name='from_user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='Profile.profile'),
        ),
    ]