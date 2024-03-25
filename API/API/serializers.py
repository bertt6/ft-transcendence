from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from Apps.Profile.models import Profile, Stats


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=6,
        max_length=68
    )
    password2 = serializers.CharField(
        write_only=True,
        required=True,
        min_length=6,
        max_length=68
    )
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])

        profile = Profile.objects.create(
            user=user,
            nickname="",
            #stats=Stats.objects.create(total_games=0, total_wins=0, total_losses=0, points=0)
        )
        profile.save()
        user.save()

        return user


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        write_only=True,
        required=True
    )
    new_password = serializers.CharField(
        write_only=True,
        required=True,
        min_length=6,
        max_length=68
    )
    new_password2 = serializers.CharField(
        write_only=True,
        required=True,
        min_length=6,
        max_length=68
    )

    class Meta:
        model = User
        fields = ('old_password', 'new_password', 'new_password2')

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password2']:
            raise serializers.ValidationError({"new_password": "Password fields didn't match."})

        return attrs

