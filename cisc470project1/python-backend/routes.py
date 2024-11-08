from flask import Blueprint, request, jsonify

from auth_utils import generate_token, login_required
from models import db, User, Todo, SharedList

main_blueprint = Blueprint('main', __name__)


# User registration
@main_blueprint.route('/auth/register', methods=['POST'])
def register():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    if User.query.filter_by(email=email).first():
        return jsonify({"error": "User already exists"}), 400
    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"}), 201


# User login
@main_blueprint.route('/auth/login', methods=['POST'])
def login():
    data = request.json
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if user and user.check_password(password):
        token = generate_token(user.id)
        return jsonify({"token": token}), 200  # Return token on successful login
    return jsonify({"error": "Invalid credentials"}), 401


# Create a new to-do (protected route)
@main_blueprint.route('/todos', methods=['POST'])
@login_required
def create_todo(user_id):
    data = request.json
    text = data.get('text')
    todo = Todo(user_id=user_id, text=text)
    db.session.add(todo)
    db.session.commit()
    return jsonify({"message": "Todo created successfully"}), 201


# Get all todos for a user (protected route)
@main_blueprint.route('/todos', methods=['GET'])
@login_required
def get_todos(user_id):
    todos = Todo.query.filter_by(user_id=user_id).all()
    return jsonify([{"id": todo.id, "text": todo.text, "done": todo.done} for todo in todos]), 200


# Share todo list (protected route)
@main_blueprint.route('/todos/share', methods=['POST'])
@login_required
def share_todo_list(user_id):
    data = request.json
    shared_with_email = data.get('email')
    shared_with_user = User.query.filter_by(email=shared_with_email).first()
    if not shared_with_user:
        return jsonify({"error": "User not found"}), 404
    shared_list = SharedList(owner_id=user_id, shared_with_id=shared_with_user.id)
    db.session.add(shared_list)
    db.session.commit()
    return jsonify({"message": "Todo list shared successfully"}), 201


# Get shared lists (protected route)
@main_blueprint.route('/todos/shared-with', methods=['GET'])
@login_required
def get_shared_with(user_id):
    shared_with = SharedList.query.filter_by(owner_id=user_id).all()
    return jsonify([{"email": User.query.get(item.shared_with_id).email} for item in shared_with]), 200


# Get accessible lists (protected route)
@main_blueprint.route('/todos/accessible-lists', methods=['GET'])
@login_required
def get_accessible_lists(user_id):
    # Retrieve all users who have shared their to-do list with the current user
    accessible = SharedList.query.filter_by(shared_with_id=user_id).all()
    return jsonify([{"email": User.query.get(item.owner_id).email} for item in accessible]), 200


# Route to get the to-do list of a specific user who shared it with the current user
@main_blueprint.route('/todos/shared/<string:owner_email>', methods=['GET'])
@login_required
def get_todo_list_for_user(user_id, owner_email):
    # Get the user who owns the shared list
    owner = User.query.filter_by(email=owner_email).first()
    if not owner:
        return jsonify({"error": "User not found"}), 404

    # Check if the current user has access to view this owner's to-do list via SharedList
    shared_entry = SharedList.query.filter_by(owner_id=owner.id, shared_with_id=user_id).first()
    if not shared_entry:
        return jsonify({"error": "Access denied"}), 403

    # Retrieve the to-do list for the specified owner
    todos = Todo.query.filter_by(user_id=owner.id).all()
    todo_list = [{"id": todo.id, "text": todo.text, "done": todo.done} for todo in todos]

    return jsonify(todo_list), 200


# Unshare todo list (protected route)
@main_blueprint.route('/todos/unshare', methods=['POST'])
@login_required
def unshare_todo_list(user_id):
    data = request.json
    shared_with_email = data.get('email')
    shared_with_user = User.query.filter_by(email=shared_with_email).first()
    if not shared_with_user:
        return jsonify({"error": "User not found"}), 404

    # Find the shared record and delete it
    shared_list_entry = SharedList.query.filter_by(owner_id=user_id, shared_with_id=shared_with_user.id).first()
    if not shared_list_entry:
        return jsonify({"error": "This user does not have access to your todo list"}), 404

    db.session.delete(shared_list_entry)
    db.session.commit()
    return jsonify({"message": "Access removed successfully"}), 200


# Delete a specific to-do (protected route)
@main_blueprint.route('/todos/<int:todo_id>', methods=['DELETE'])
@login_required
def delete_todo(user_id, todo_id):
    # Find the to-do item by ID and check that it belongs to the current user
    todo = Todo.query.filter_by(id=todo_id, user_id=user_id).first()
    if not todo:
        return jsonify({"error": "Todo item not found or access denied"}), 404

    db.session.delete(todo)
    db.session.commit()
    return jsonify({"message": "Todo deleted successfully"}), 200


# Update a specific to-do (protected route)
@main_blueprint.route('/todos/<int:todo_id>', methods=['PUT'])
@login_required
def update_todo(user_id, todo_id):
    data = request.json
    todo = Todo.query.filter_by(id=todo_id, user_id=user_id).first()
    if not todo:
        return jsonify({"error": "Todo item not found or access denied"}), 404

    # Update the to-do item with the new data
    todo.text = data.get('text', todo.text)
    todo.done = data.get('done', todo.done)
    db.session.commit()
    return jsonify({"message": "Todo updated successfully"}), 200
