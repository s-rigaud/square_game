# Generated by Django 3.1.7 on 2021-03-21 00:28

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Game",
            fields=[
                (
                    "id",
                    models.AutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("owner", models.CharField(max_length=50)),
                ("visitor", models.CharField(max_length=50)),
                ("turn", models.CharField(max_length=50)),
                ("grid_size", models.SmallIntegerField()),
                (
                    "_moves",
                    models.TextField(
                        default='{"owner": {"h": [], "v": []}, "visitor": {"h": [], "v": []}}'
                    ),
                ),
            ],
        ),
    ]
