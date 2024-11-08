import jwt
from flask import request, jsonify, current_app
from functools import wraps
from datetime import datetime, timedelta


# Generate JWT token
def generate_token(user_id):
    payload = {
        "user_id": user_id,
        "exp": datetime.utcnow() + timedelta(hours=1)  # Token expires in 1 hour
    }
    token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm="HS256")
    return token


# Verify JWT token
def verify_token(token):
    try:
        payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
        return payload["user_id"]
    except jwt.ExpiredSignatureError:
        return None  # Token expired
    except jwt.InvalidTokenError:
        return None  # Invalid token


# Decorator to protect routes
def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get("Authorization")
        if auth_header:
            try:
                token = auth_header.split(" ")[1]  # Expecting 'Bearer <token>'
                user_id = verify_token(token)
                if user_id:
                    return f(user_id=user_id, *args, **kwargs)
            except IndexError:
                pass
        return jsonify({"error": "Unauthorized"}), 401

    return decorated_function
