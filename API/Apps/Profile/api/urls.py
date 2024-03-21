from django.urls import path
from .views import ProfileView, ProfileGameHistoryView, ProfileStatsView, ProfileDetailView
urlpatterns = [
    #path('profile/', ProfileView.as_view(), name='profile'),
    path('profile', ProfileDetailView.as_view(), name='profileDetail'),
    path('profile/stats/', ProfileStatsView.as_view(), name='profile_stats'),
    path('profile/<int:profile_id>/history/', ProfileGameHistoryView.as_view(), name='profile_game_history')
]
