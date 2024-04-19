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


def remove_player_in_que(player):
    all_keys = get_players_in_que()
    all_keys.remove(player)
    cache.set('players-in-que', json.dumps(all_keys))


def clear_players_in_que():
    cache.set('players-in-que', [])


def get_players_in_game(game_id):
    all_keys_json = cache.get(game_id)
    if all_keys_json is None:
        return []
    return json.loads(all_keys_json)


def get_player_count_in_game(game_id):
    all_keys_json = cache.get(game_id)
    if all_keys_json is None:
        return 0
    all_keys = json.loads(all_keys_json)
    count = sum(1 for player in all_keys if player['player'] != 'spectator')
    return count


def add_player_in_game(game_id, participant_type, data, websocket_id):
    print(data)
    all_keys = get_players_in_game(game_id)
    participant = {
        'player': participant_type,
        'websocketId': websocket_id,
        'nickname': data['nickname'],
        'profile_picture': data['profile_picture'],
    }
    all_keys.append(participant)
    print(all_keys)
    cache.set(game_id, json.dumps(all_keys))


def set_cache(game_id, participants):
    cache.set(game_id, json.dumps(participants))


def clear_player_in_game(game_id, channel_name):
    all_keys = get_players_in_game(game_id)
    for player in all_keys:
        if player['websocketId'] == channel_name:
            all_keys.remove(player)
    cache.set(game_id, json.dumps(all_keys))
