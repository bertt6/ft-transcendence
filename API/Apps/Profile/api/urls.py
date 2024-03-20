from django.urls import path
from .views import ProfileView, ProfileGameHistoryView, ProfileStatsView, ProfileDetailView
urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/<int:profile_id>', ProfileDetailView.as_view(), name='profileDetail'),
    path('profile/<int:profile_id>/stats/', ProfileStatsView.as_view(), name='profile_stats'),
    path('profile/<int:profile_id>/history/', ProfileGameHistoryView.as_view(), name='profile_game_history')
]
