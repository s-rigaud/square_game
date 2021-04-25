import json

from django.db import models
from typing import Tuple


class Game(models.Model):
    """
    moves stored pourly into DB as JsonField not accepted
    """

    owner = models.CharField(max_length=50)
    owner_score = models.PositiveSmallIntegerField(default=0)
    visitor = models.CharField(max_length=50)
    visitor_score = models.PositiveSmallIntegerField(default=0)
    turn = models.CharField(max_length=50)
    grid_size = models.PositiveSmallIntegerField()
    _moves = models.TextField(default="[]")
    last_move = models.CharField(max_length=50, null=True)

    def __repr__(self):
        return f"Game: {self.id}"

    @property
    def oriented_bar_max_number(self) -> int:
        """Maxmum bar count with an orientation"""
        return self.grid_size ** 2 + self.grid_size

    @property
    def moves(self) -> list:
        return json.loads(self._moves)

    @moves.setter
    def moves(self, moves: list):
        self._moves = json.dumps(moves)
        self.save()

    @property
    def ended(self) -> bool:
        """Return if some moves are still possible"""
        maximum_moves = 2 * self.oriented_bar_max_number
        return len(self.moves) == maximum_moves

    def get_available_moves(self) -> dict:
        """Return playable moves on both axis"""
        horizontal_bars = set(f"h{i}" for i in range(self.oriented_bar_max_number))
        vertical_bars = set(f"v{i}" for i in range(self.oriented_bar_max_number))

        return (horizontal_bars | vertical_bars) - set(self.moves)

    def get_player_tag(self, player_hash: str) -> str:
        return "owner" if player_hash == self.owner else "visitor"

    def add_move(self, move: str):
        """Add the move to the game and swap player turn before
        saving in DB.
        """
        current_moves = self.moves
        current_moves.append(move)
        self.moves = current_moves

        self.last_move = move
        if self.turn == self.owner:
            self.owner_score += self.played_move_scores(move)
            self.turn = self.visitor
        else:
            self.visitor_score += self.played_move_scores(move)
            self.turn = self.owner
        self.save()

    def is_valid_move(self, move: str, player_hash: str) -> Tuple[bool, str]:
        """Validate a given game move.
        Moves should follow the format "h5" or "v10".
        """
        message = ""
        if not self.visitor:
            message = "Your friend didn't join yet"

        elif player_hash != self.turn:
            message = "It's not your turn"

        elif self.ended:
            message = "The game is over"

        elif not move or len(move) < 2:
            message = f"Move is not valid and too short: '{move}'"

        move_letter = move[0]
        move_numbers = move[1:]
        if move_letter not in ("h", "v"):
            message = f"Move is not valid. It uses a wrong letter: '{move}'"
        try:
            move_numbers = int(move_numbers)
        except ValueError:
            message = f"Move is not valid. It uses a wrong number format: '{move}'"

        # Return now before exploiting numbers and letters
        if message:
            return False, message

        if move_numbers < 0 or move_numbers > self.oriented_bar_max_number - 1:
            message = f"Move is not valid. Number is too high: '{move}'"
        elif move in self.moves:
            message = f"Move is not valid. Someone already made it"

        if message:
            return False, message
        return True, message

    def played_move_scores(self, move: str) -> int:
        """Compute if last move close a square"""
        score = 0
        current_moves = self.moves
        move_orientation = move[0]
        move_index = int(move[1:])

        if move_orientation == "v":
            if (
                f"h{move_index}" in current_moves
                and f"h{move_index+self.grid_size}" in current_moves
                and f"v{move_index+1}" in current_moves
            ):
                # left side of square placed
                score += 1
            if (
                f"h{move_index-1}" in current_moves
                and f"h{move_index-1+self.grid_size}" in current_moves
                and f"v{move_index-1}" in current_moves
            ):
                # right side of square placed
                score += 1
        else:
            if (
                f"v{move_index}" in current_moves
                and f"h{move_index+self.grid_size}" in current_moves
                and f"v{move_index+1}" in current_moves
            ):
                # upper side of square placed
                score += 1
            if (
                f"v{move_index-self.grid_size}" in current_moves
                and f"h{move_index-self.grid_size}" in current_moves
                and f"v{move_index-self.grid_size+1}" in current_moves
            ):
                # lower side of square placed
                score += 1
        return score
