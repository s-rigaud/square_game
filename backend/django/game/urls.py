from django.urls import path

from . import views

urlpatterns = [
    # -> 200  {"game_id": 78, "player_hash": "aa777"}
    path("game/create", views.create, name="game-create"),
    # -> 200  {"player_hash": "622"}
    # -> 400 {"message": "error_message"}
    path("game/<int:game_id>/join", views.join, name="game-join"),
    # -> 200  {"player_hash": "622"}
    # -> 400 {"message": "error_message"}
    # -> 403 {"message": "error_message"}
    path("game/<int:game_id>/play", views.play, name="game-play"),
    # -> 200  {"player_hash": "622"}
    # -> 403 {"message": "error_message"}
    path("game/<int:game_id>/activity", views.activity, name="game-activity"),
]
