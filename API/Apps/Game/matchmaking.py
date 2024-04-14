import time
import timeit
from datetime import datetime

from Apps.Game.cache import get_players_in_que, remove_player_in_que


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


#players = [
#    {'nickname': 'yugurlu', 'win_rate': 60, 'total_game': 30, 'mmr': 876},
#    {'nickname': 'ofirat', 'win_rate': 41, 'total_game': 23, 'mmr': 234},
#    {'nickname': 'bert', 'win_rate': 18, 'total_game': 10, 'mmr': 1031},
#    {'nickname': 'mkm_industries', 'win_rate': 31, 'total_game': 63, 'mmr': 453},
#    {'nickname': 'kkanig', 'win_rate': 21, 'total_game': 13, 'mmr': 153},
#    {'nickname': 'jack', 'win_rate': 21, 'total_game': 13, 'mmr': 12},
#    {'nickname': 'egenc', 'win_rate': 21, 'total_game': 13, 'mmr': 353},
#    {'nickname': 'sylas', 'win_rate': 21, 'total_game': 13, 'mmr': 1189},
#    {'nickname': 'windows', 'win_rate': 21, 'total_game': 13, 'mmr': 53},
#    {'nickname': 'lol', 'win_rate': 21, 'total_game': 13, 'mmr': 465},
#    {'nickname': 'john', 'win_rate': 21, 'total_game': 13, 'mmr': 90},
#    {'nickname': 'wick', 'win_rate': 21, 'total_game': 13, 'mmr': 1},
#]


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




def find_small_diff(players):
    small_diff = 0
    for i in range(len(players)):
        if i + 1 < len(players) and ((players[i + 1]['mmr'] - players[i]['mmr']) < small_diff or i == 0):
            small_diff = players[i + 1]['mmr'] - players[i]['mmr']
            matched_players = [players[i],  players[i + 1]]
    return matched_players


def match(players, ideal_mmr):
    player1, player2 = find_small_diff(players)
    if (player2['mmr'] - player1['mmr']) < ideal_mmr:
        print(f"{player1['nickname']} ile {player2['nickname']} matched!")
        remove_player_in_que(player1)
        remove_player_in_que(player2)
        return [player1, player2]



start = time.time()
#match_making()
print('Time: ', time.time() - start)

