# Generated by Django 5.0.3 on 2024-03-19 07:39

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('SocialMedia', '0005_tweet_comments'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='tweet',
            name='comments',
        ),
    ]