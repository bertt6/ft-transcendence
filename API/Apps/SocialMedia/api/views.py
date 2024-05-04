from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import *
from rest_framework.response import Response
from .serializers import TweetPostSerializer, TweetGetSerializer, \
    CommentPostSerializer, TweetGetWithDetailSerializer, CommentGetSerializer
from ..models import Tweet, Comment
from rest_framework.pagination import PageNumberPagination

from ...Profile.api.Serializers import ProfileGetSerializer

paginator = PageNumberPagination()
paginator.page_size = 20


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tweets(request):
    try:
        profile = request.user.profile
        blocked_users_ids = profile.blocked_users.values_list('id', flat=True)
        blocked_users_filter = ~Q(from_user__id__in=blocked_users_ids) & ~Q(from_user__blocked_users=profile)
        tweets = Tweet.objects.all().filter(blocked_users_filter).order_by('-date')
        paginator = PageNumberPagination()
        paginator.page_size = 10
        paginated_data = paginator.paginate_queryset(tweets, request)
        serializer = TweetGetSerializer(paginated_data, many=True)
        return paginator.get_paginated_response({'success': True, 'tweets': serializer.data})
    except Tweet.DoesNotExist:
        return Response({"error": "Tweets not found"}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tweet_and_comments(request, tweet_id):
    try:
        profile = request.user.profile
        tweet = Tweet.objects.get(id=tweet_id)
        tweet = TweetGetSerializer(tweet)
        blocked_users_ids = profile.blocked_users.values_list('id', flat=True)
        blocked_users_filter = ~Q(from_user__id__in=blocked_users_ids)
        comments = Comment.objects.filter(tweet=tweet_id).filter(blocked_users_filter).order_by('-date')
        paginator = PageNumberPagination()
        paginator.page_size = 10
        paginated_data = paginator.paginate_queryset(comments, request)
        serializer = CommentGetSerializer(paginated_data, many=True)
        sorted_comments = sorted(serializer.data, key=lambda x: x['date'], reverse=True)
        return paginator.get_paginated_response({'success': True, 'tweet': tweet.data, 'comments': sorted_comments})
    except Comment.DoesNotExist or Tweet.DoesNotExist:
        Response({"error": "Data not found"}, status=404)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_tweet(request):
    profile = request.user.profile
    tweet_data = request.data.copy()
    tweet_data['from_user'] = profile.pk
    serializer = TweetPostSerializer(data=tweet_data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    response_data = serializer.data
    response_data['from_user'] = ProfileGetSerializer(profile).data
    return Response({"success": True, "tweet": response_data})


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_tweet(request, tweet_id):
    profile = request.user.profile

    try:
        tweet = Tweet.objects.get(id=tweet_id)
    except Tweet.DoesNotExist:
        return Response({"error": "Tweet not found"}, status=404)
    if tweet.from_user != profile:
        return Response({"error": "Unauthorized"}, status=403)
    tweet.delete()
    return Response({"success": True, "message": "Tweet deleted successfully"})


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_comment(request):
    try:
        serializer = CommentPostSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(from_user=request.user.profile)
        return Response(serializer.data)
    except Tweet.DoesNotExist:
        return Response({"error": "Tweet not found"}, status=404)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_comment(request, comment_id):
    profile = request.user.profile

    try:
        comment = Comment.objects.get(id=comment_id)
    except Comment.DoesNotExist:
        return Response({"error": "Comment not found"}, status=404)

    if comment.from_user != profile:
        return Response({"error": "Unauthorized"}, status=403)
    comment.delete()
    return Response({"success": True, "message": "Comment deleted successfully"})


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def like_tweet(request, tweet_id):
    profile = request.user.profile

    try:
        tweet = Tweet.objects.get(id=tweet_id)
    except Tweet.DoesNotExist:
        return Response({"error": "Tweet not found"}, status=404)

    if profile in tweet.liked_users.all():
        tweet.liked_users.remove(profile)
        message = "Tweet unliked successfully"
    else:
        tweet.liked_users.add(profile)
        message = "Tweet liked successfully"

    return Response({"success": True, "message": message}, status=200)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def like_comment(request, comment_id):
    profile = request.user.profile

    try:
        comment = Comment.objects.get(id=comment_id)
    except Comment.DoesNotExist:
        return Response({"error": "Comment not found"}, status=404)

    if profile in comment.liked_users.all():
        comment.liked_users.remove(profile)
        message = "Comment unliked successfully"
    else:
        comment.liked_users.add(profile)
        message = "Comment liked successfully"

    return Response({"success": True, "message": message}, status=200)
