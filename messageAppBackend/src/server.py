from datetime import datetime
import uuid

from flask import Flask, request, abort, jsonify

app = Flask(__name__)

users = []
messages = dict()
chat = []


@app.route("/")
def hello():
    return "hello\n"


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get('username', None)
    if username is None or username in users:
        abort(401)
    else:
        users.append(username)
        return jsonify(status="OK",
                       message="Successful")


@app.route("/send", methods=["POST"])
def send():
    username = request.json.get('username', None)
    message = request.json.get('message', None)

    if username is None or username not in users:
        abort(401)

    if message is None or message == "":
        abort(400)

    msg_id = str(uuid.uuid4())
    messages[msg_id] = {
        'username': username,
        'message': message,
        'timestamp': datetime.now(),
        'id': msg_id
    }

    chat.append(msg_id)
    return jsonify({
        "id": msg_id,
    })


@app.route('/get', defaults={'last_id': None})
@app.route('/get/<last_id>', methods=["GET"])
def get(last_id):
    if chat is None or len(chat) == 0:
        return []
    chat_index = get_next_index(last_id) if last_id else 0
    ids_to_return = chat[chat_index + 1:]
    results = map(lambda x: messages[x], ids_to_return)
    return jsonify(sorted(results, key=lambda x: x['timestamp']))


@app.route('/updates/<last_id>', methods=["GET"])
def updates(last_id):
    chat_index = get_next_index(last_id) if last_id else 0
    result = {
        'new_messages': False
    }
    if chat_index < len(chat) - 1:
        result['new_messages'] = True

    return jsonify(result)


def get_next_index(last_id):
    try:
        return chat.index(last_id)
    except ValueError as e:
        abort(400)


if __name__ == "__main__":
    app.run(debug=True, host='0.0.0.0')
