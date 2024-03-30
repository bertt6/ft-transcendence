from rest_framework import serializers
from Apps.Profile.api.Serializers import ProfileGetSerializer
from Apps.SocialMedia.models import Comment, Tweet


class CommentGetSerializer(serializers.ModelSerializer):
    from_user = ProfileGetSerializer(read_only=True)

    class Meta:
        model = Comment
        fields = '__all__'


class CommentPostSerializer(serializers.ModelSerializer):
    content = serializers.CharField(
        required=True,
        max_length=250,
    )
    from_user = ProfileGetSerializer(read_only=True)
    class Meta:
        model = Comment
        fields = '__all__'


class TweetGetSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    from_user = ProfileGetSerializer(read_only=True)
    date = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    content = serializers.CharField(
        required=True,
        max_length=250,
    )

    class Meta:
        model = Tweet
        fields = '__all__'

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None


class TweetGetWithDetailSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField()
    from_user = ProfileGetSerializer(read_only=True)
    image_url = serializers.SerializerMethodField()
    date = serializers.DateTimeField(format='%Y-%m-%d %H:%M:%S')
    content = serializers.CharField(
        required=True,
        max_length=250,
    )
    comments = CommentGetSerializer(many=True, read_only=True)

    class Meta:
        model = Tweet
        fields = '__all__'

    def get_image_url(self, obj):
        if obj.image:
            return obj.image.url
        return None

class TweetPostSerializer(serializers.ModelSerializer):
    content = serializers.CharField(
        required=True,
        max_length=250,
    )

    class Meta:
        model = Tweet
        fields = '__all__'
