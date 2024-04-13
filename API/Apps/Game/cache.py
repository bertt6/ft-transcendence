from django.core.cache import cache
import json


def get_players_in_que():
    all_keys_json = cache.get('players-in-que')
    if all_keys_json is None:
        return []
    return json.loads(all_keys_json)


def add_player_in_que(player):
    all_keys = get_players_in_que()
    all_keys.append(player)
    cache.set('players-in-que', json.dumps(all_keys))


def clear_players_in_que():
    cache.set('players-in-que', [])
