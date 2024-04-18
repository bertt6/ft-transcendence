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


def get_players_in_game(game_id):
    all_keys_json = cache.get(game_id)
    if all_keys_json is None:
        return 0
    return json.loads(all_keys_json)


def add_player_in_game(game_id):
    all_keys = get_players_in_game(game_id)
    all_keys = all_keys + 1
    cache.set(game_id, json.dumps(all_keys))


def clear_player_in_game(game_id):
    all_keys = get_players_in_game(game_id)
    all_keys = all_keys - 1
    cache.set(game_id, json.dumps(all_keys))
