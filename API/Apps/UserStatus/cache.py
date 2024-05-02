from django.core.cache import cache
import json


def get_online_users():
    all_keys_json = cache.get('online_users')
    if all_keys_json is None:
        return []
    return json.loads(all_keys_json)


def set_online_user(user):
    all_users = get_online_users()
    if not any(u['nickname'] == user['nickname'] for u in all_users):
        all_users.append(user)
        cache.set('online_users', json.dumps(all_users))

def update_online_user(nickname, status):
    all_keys = get_online_users()
    for user in all_keys:
        if user['nickname'] == nickname:
            user['status'] = status
    cache.set('online_users', json.dumps(all_keys))

def remove_online_user(nickname):
    all_keys = get_online_users()
    all_keys = [user for user in all_keys if user['nickname'] != nickname]
    cache.set('online_users', json.dumps(all_keys))
