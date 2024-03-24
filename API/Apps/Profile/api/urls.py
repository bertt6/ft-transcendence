from django.urls import path
from .views import ProfileGameHistoryView, ProfileStatsView, ProfileDetailView, ProfileFriendsView

urlpatterns = [
    #path('profile/', ProfileView.as_view(), name='profile'),
    path('profile', ProfileDetailView.as_view(), name='profileDetail'),
    path('profile/stats', ProfileStatsView.as_view(), name='profile_stats'),
    path('profile/history/', ProfileGameHistoryView.as_view(), name='profile_game_history'),
    path('profile/friends', ProfileFriendsView.as_view(), name='profile_friends')
]
