from flask import Flask, jsonify, render_template, request
from model import db, Reservation, connect_to_db, find_available_reservations
from dateutil.parser import parse

app = Flask(__name__)
app.secret_key = 'secret'


@app.route('/')
def home():
    return render_template('index.html')

@app.route('/<path>')
def route(path):
    return render_template('index.html')


@app.route('/get-available-times')
def get_available_times():
    start_time = parse(request.args.get("startTime"))
    end_time = parse(request.args.get("endTime"))
    username = request.args.get("username")

    available_times = find_available_reservations(start_time, end_time, username)
    return jsonify(available_times)


@app.route('/make-reservation', methods=["POST"])
def make_reservation():
    username = request.json.get('username')
    time = request.json.get('time')
    reservation = Reservation(username=username, time=time)
    db.session.add(reservation)
    db.session.commit()
    return "OK"

@app.route('/get-current-reservations')
def get_current_reservations():
    username = request.args.get('username')
    reservations = Reservation.query.filter_by(username=username)
    print(reservations)
    return jsonify([res.to_dict() for res in reservations])

@app.route('/cancel-reservation/<int:res_id>')
def cancel_reservation(res_id):
    reservation = Reservation.query.get(res_id)
    username = reservation.username
    db.session.delete(reservation)
    db.session.commit()
    reservations_remaining = Reservation.query.filter_by(username=username)
    return jsonify([res.to_dict() for res in reservations_remaining])


if __name__ == '__main__':
    connect_to_db(app)
    app.run('0.0.0.0', debug=True)
