from Apps.Game.cache import remove_player_in_que

def find_small_diff(players):
    small_diff = 0
    for i in range(len(players)):
        if i + 1 < len(players) and ((players[i + 1]['mmr'] - players[i]['mmr']) < small_diff or i == 0):
            small_diff = players[i + 1]['mmr'] - players[i]['mmr']
            matched_players = [players[i],  players[i + 1]]
    return matched_players


def match(players, ideal_mmr):
    player1, player2 = find_small_diff(players)
    if (player2['mmr'] - player1['mmr']) < ideal_mmr:  # for testing
        print(f"{player1['nickname']} ile {player2['nickname']} matched!")
        remove_player_in_que(player1)
        remove_player_in_que(player2)
        return [player1, player2]
    return []


