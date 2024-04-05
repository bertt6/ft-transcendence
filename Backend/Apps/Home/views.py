from django.shortcuts import render, redirect


def home(request):
    return render(request, 'home/home.html')


def index(request):
    return redirect('home')