from django.urls import path

from Apps.SocialMedia.api.views import post_tweet, get_tweets, post_comment, delete_tweet, get_tweet_with_details, \
    delete_comment, like_tweet, like_comment

urlpatterns = [
    path('post_tweet', post_tweet, name='post_tweet'),
    path('get_tweets', get_tweets, name='get_tweets'),
    path('get_tweet_with_details/<int:tweet_id>', get_tweet_with_details, name='get_tweet_with_details'),
    path('delete_tweet/<int:tweet_id>', delete_tweet, name='delete_tweet'),
    path('like_tweet/<int:tweet_id>', like_tweet, name='like_tweet'),


    path('post_comment', post_comment, name='post_comment'),
    path('delete_comment/<int:comment_id>', delete_comment, name='delete_comment'),
    path('like_comment/<int:comment_id>', like_comment, name='like_comment'),
]
