from django.shortcuts import render

# Create your views here.

def index(request):
    return render(request, 'social/social.html')


def tweet(request, tweet_id):
    return render(request, 'social/social.html', {'tweet_id': tweet_id})