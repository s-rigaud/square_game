from random import randint

from django.http import JsonResponse
from django.shortcuts import get_object_or_404
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Game


def get_random_hash() -> str:
    """Should be replace with hashlib or md5"""
    return str(randint(1, 999999))


def create(request) -> JsonResponse:
    """Create a new game with a specific size"""
    grid_size = request.GET.get("grid_size", 3)
    if int(grid_size) < 2 or int(grid_size) > 10:
        return JsonResponse(
            data={
                "message": f"Grid size should be between 2 and 10. Not '{grid_size}'."
            },
            status=400,
        )

    owner_hash = get_random_hash()
    g = Game(owner=owner_hash, grid_size=grid_size, turn="")
    g.save()
    return JsonResponse(data={"game_id": g.id, "player_hash": owner_hash}, status=201)


def join(request, game_id: int) -> JsonResponse:
    """Allow user to join a game and retrieve infos about it"""
    game = get_object_or_404(Game, pk=game_id)

    if game.visitor:
        return JsonResponse(
            data={"message": "Already two connected players"}, status=403
        )

    visitor_hash = get_random_hash()
    game.visitor = visitor_hash
    game.turn = game.owner
    game.save()
    return JsonResponse(
        data={"player_hash": visitor_hash, "grid_size": game.grid_size}, status=200
    )


@csrf_exempt
def play(request, game_id: int) -> JsonResponse:
    """Place a bar on the game"""
    game = get_object_or_404(Game, pk=game_id)
    hash = request.headers.get("Authorization", "")
    request_body = json.loads(request.body.decode())
    move = request_body.get("position", "")

    if hash not in (game.owner, game.visitor):
        return JsonResponse(data={}, status=403)

    success, message = game.is_valid_move(move, hash)
    if not success:
        return JsonResponse(data={"message": message}, status=400)

    game.add_move(move=move)
    return JsonResponse(data={}, status=200)


@csrf_exempt
def activity(request, game_id: int) -> JsonResponse:
    """Activity infos about the game like scores, last move and current turn"""
    game = get_object_or_404(Game, pk=game_id)
    hash = request.headers.get("Authorization", "")
    if hash not in (game.owner, game.visitor):
        return JsonResponse(data={}, status=403)

    player_can_play = not game.ended and bool(game.visitor) and game.turn == hash
    if hash == game.owner:
        my_score, opposant_score = game.owner_score, game.visitor_score
    else:
        my_score, opposant_score = game.visitor_score, game.owner_score

    return JsonResponse(
        data={
            "can_play": player_can_play,
            "last_move": game.last_move,
            "my_score": my_score,
            "opposant_score": opposant_score,
        },
        status=200,
    )
