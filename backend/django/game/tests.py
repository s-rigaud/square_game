from .models import Game
from django.test import TestCase


class GameTestCase(TestCase):
    def setUp(self):
        Game.objects.create(
            id=1, owner="1", visitor="2", turn="1", grid_size=3, last_move=None
        )

    def test_compute_score(self):
        game = Game.objects.get(id=1)
