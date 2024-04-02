from django.core.cache import cache
import json


def get_online_users():
    all_keys_json = cache.get('online_users')
    if all_keys_json is None:
        return []
    return json.loads(all_keys_json)


def set_online_user(user_id):
    all_keys = get_online_users()
    all_keys.append(user_id)
    cache.set('online_users', json.dumps(all_keys))


def remove_online_user(user_id):
    all_keys = get_online_users()
    all_keys.remove(user_id)
    cache.set('online_users', json.dumps(all_keys))
