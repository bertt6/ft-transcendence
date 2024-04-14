import time
import timeit
from datetime import datetime


class Player:
    def __init__(self):
        self.mmr = 100

    def win_games(self, opponent_mmr):
        k_factor = 32
        expected_score = 1 / (1 + 10 ** ((opponent_mmr - self.mmr) / 400))
        self.mmr += k_factor * (1 - expected_score)

    def lose_games(self, opponent_mmr):
        k_factor = 32
        expected_score = 1 / (1 + 10 ** ((opponent_mmr - self.mmr) / 400))
        self.mmr += k_factor * (0 - expected_score)


players = [
    {'nickname': 'yugurlu', 'win_rate': 60, 'total_game': 30, 'mmr': 876},
    {'nickname': 'ofirat', 'win_rate': 41, 'total_game': 23, 'mmr': 234},
    {'nickname': 'bert', 'win_rate': 18, 'total_game': 10, 'mmr': 1031},
    {'nickname': 'mkm_industries', 'win_rate': 31, 'total_game': 63, 'mmr': 453},
    {'nickname': 'kkanig', 'win_rate': 21, 'total_game': 13, 'mmr': 153},
]


def win_games(self, opponent_mmr):
    k_factor = 32
    expected_score = 1 / (1 + 10 ** ((opponent_mmr - self.mmr) / 400))
    self.mmr += k_factor * (1 - expected_score)


def lose_games(self, opponent_mmr):
    k_factor = 32
    expected_score = 1 / (1 + 10 ** ((opponent_mmr - self.mmr) / 400))
    self.mmr += k_factor * (0 - expected_score)


player1 = Player()
player2 = Player()
player3 = Player()

player1.win_games(player2.mmr)
player2.lose_games(player1.mmr)

player3.win_games(2000)

# print(player1.mmr)
# print(player2.mmr)
# print(player3.mmr)


players = sorted(players, key=lambda x: x['mmr'])


def find_small_diff():
    small_diff = players[0]['mmr']
    for i in range(len(players)):
        if i + 1 < len(players) and (players[i + 1]['mmr'] - players[i]['mmr']) < small_diff:
            small_diff = players[i + 1]['mmr'] - players[i]['mmr']
            matched_players = [players[i],  players[i + 1]]
    return matched_players


def match_making(ideal_mmr):
    player1, player2 = find_small_diff()
    if (player2['mmr'] - player1['mmr']) < ideal_mmr:
        print(f"{player1['nickname']} ile {player2['nickname']} matched!")
        players.remove(player1)
        players.remove(player2)
        return True



start = timeit.default_timer()

while len(players) != 0:
    time.sleep(3)
    ideal_mmr = 1
    while True and len(players) > 1:
        if match_making(ideal_mmr):
            break
        ideal_mmr += 1

stop = timeit.default_timer()
print('Time: ', stop - start)