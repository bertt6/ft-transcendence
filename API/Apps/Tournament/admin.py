from django.contrib import admin

from Apps.Tournament.models import Tournament, Round

# Register your models here.

admin.site.register(Tournament)
admin.site.register(Round)