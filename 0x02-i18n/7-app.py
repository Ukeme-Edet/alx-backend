#!/usr/bin/env python3
"""
Flask app
"""
from flask import Flask, render_template, request, g
from flask_babel import Babel
import pytz

app = Flask(__name__)
babel = Babel(app)

users = {
    1: {"name": "Balou", "locale": "fr", "timezone": "Europe/Paris"},
    2: {"name": "Beyonce", "locale": "en", "timezone": "US/Central"},
    3: {"name": "Spock", "locale": "kg", "timezone": "Vulcan"},
    4: {"name": "Teletubby", "locale": None, "timezone": "Europe/London"},
}


class Config:
    """
    Config class
    """

    LANGUAGES = ["en", "fr"]
    BABEL_DEFAULT_LOCALE = "en"
    BABEL_DEFAULT_TIMEZONE = "UTC"


app.config.from_object(Config)


def get_user() -> dict:
    """
    Get user

    Returns:
        dict: User
    """
    try:
        return users.get(int(request.args.get("login_as")))
    except Exception:
        return None


@app.before_request
def before_request() -> None:
    """
    Before request
    """
    user = get_user()
    if user:
        g.user = user


@app.route("/")
def root() -> str:
    """
    Main route

    Returns:
        str: Render template
    """
    return render_template("6-index.html")


@babel.localeselector
def get_locale() -> str:
    """
    Get locale

    Returns:
        str: Locale
    """
    if request.args.get("locale") in app.config["LANGUAGES"]:
        return request.args.get("locale")
    if g.get("user") and g.user.get("locale") in app.config["LANGUAGES"]:
        return g.user["locale"]
    return request.accept_languages.best_match(app.config["LANGUAGES"])


@babel.timezoneselector
def get_timezone() -> str:
    """
    Get timezone

    Returns:
        str: Timezone
    """
    if request.args.get("timezone") in pytz.all_timezones:
        return request.args.get("timezone")
    if g.get("user") and g.user.get("timezone") in pytz.all_timezones:
        return g.user["timezone"]
    return app.config["BABEL_DEFAULT_TIMEZONE"]


if __name__ == "__main__":
    app.run(host="0.0.0.0", port="5000")
