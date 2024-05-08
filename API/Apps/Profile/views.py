from django.shortcuts import render

# Create your views here.


def index(request,profile_username=None):
    return render(request, 'profile/profile.html')