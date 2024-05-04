from django.core.cache import cache


def add_player_to_cache(data, key):
    cached_data = cache.get(key)
    if cached_data is None:
        cached_data = []
    if data not in cached_data:
        cached_data.append(data)
        cache.set(key, cached_data)
        return cached_data
    return cached_data
