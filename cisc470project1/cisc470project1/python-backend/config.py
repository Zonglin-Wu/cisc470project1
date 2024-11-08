import os


class Config:
    SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL", "postgresql+psycopg2://jingkunzhang:123@localhost:5432/todo")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.getenv("SECRET_KEY", "123")
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", "123")
