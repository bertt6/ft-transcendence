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
        print('asdasdas')
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
        )
        user.set_password(validated_data['password'])

        profile = Profile.objects.create(
            user=user,
            nickname=None,
            stats=Stats.objects.create(total_games=0, total_points=0, total_assists=0)
        )
        profile.save()
        user.save()

        return profile

    def update(self, instance, validated_data):
        print('asdasdasASDASDASDAS')


class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'
