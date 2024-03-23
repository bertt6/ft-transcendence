from django.contrib import admin

# Register your models here.

from Apps.Profile.models import Profile, Stats

admin.site.register(Profile)
admin.site.register(Stats)
