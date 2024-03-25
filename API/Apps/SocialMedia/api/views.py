from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import *
from rest_framework.response import Response
from .serializers import TweetPostSerializer, TweetGetSerializer, CommentGetSerializer, \
    CommentPostSerializer, TweetGetWithDetailSerializer
from ..models import Tweet, Comment


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tweets(request):
    try:
        tweets = Tweet.objects.all()
        serializer = TweetGetSerializer(
            tweets, many=True,
        )
        tweets = serializer.data
        return Response({'success': True, 'tweets': tweets})
    except Tweet.DoesNotExist:
        Response({"error": "Tweets not found"}, status=404)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_tweet_with_details(request, tweet_id):
    try:
        tweet = Tweet.objects.get(id=tweet_id)
        serializer = TweetGetWithDetailSerializer(
            tweet, many=False
        )
        tweet = serializer.data
        return Response({'success': True, 'tweet': tweet})
    except Tweet.DoesNotExist:
        Response({"error": "Tweet not found"}, status=404)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def post_tweet(request):
    profile = request.user.profile
    tweet_data = request.data.copy()
    tweet_data['from_user'] = profile.pk
    serializer = TweetPostSerializer(data=tweet_data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response({"success": True, "tweet": serializer.data})


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

