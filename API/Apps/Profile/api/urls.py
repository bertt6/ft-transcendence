from django.urls import path
from .views import ProfileGameHistoryView, ProfileStatsView, ProfileDetailView, ProfileFriendsView, ProfileView, \
    ProfileBlockedUsersView

urlpatterns = [
    path('profile-with-nickname/<str:profile_nickname>/', ProfileView.as_view(), name='profileWithNickname'),
    path('profile/', ProfileDetailView.as_view(), name='profileDetail'),
    path('profile/stats', ProfileStatsView.as_view(), name='profile_stats'),
    path('profile/history', ProfileGameHistoryView.as_view(), name='profile_game_history'),
    path('profile/friends', ProfileFriendsView.as_view(), name='profile_friends'),
    path('profile/block-users', ProfileBlockedUsersView.as_view(), name='profile_blocked_users'),

]
