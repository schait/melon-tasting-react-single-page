from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta

db = SQLAlchemy()


class Reservation(db.Model):
    """A reservation."""

    __tablename__ = "reservations"

    reservation_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String)
    time = db.Column(db.DateTime)

    def __repr__(self):
        return f'<Reservation username={self.username} time={self.time}>'
    
    def to_dict(self):
        return {'id': self.reservation_id,
                'username': self.username,
                'time': self.time}


""" Retrieve reservations in within the specified time range """
# Essentially copied from https://github.com/hackbrightacademy/melon_takehome/blob/main/model.py
def find_available_reservations(start_time, end_time, username):
    
    all_reservations_in_range = db.session.query(Reservation.time).filter(
        Reservation.time.between(start_time, end_time)
    )
    # get reservation times without time zone
    existing_reservation_times = {
        res[0].replace(tzinfo=None) for res in all_reservations_in_range.all()
    }

    # of existing reservations, get the ones with the user
    user_reservations = Reservation.query.filter(Reservation.username==username).all()
    user_reservation_dates = {res.time.date() for res in user_reservations}

    # Initialize list for possible times
    times = []

    # Possible reservations can only happen on the half hour
    first_reservation_time = start_time + (datetime.min - start_time) % timedelta(minutes=30)
    current = first_reservation_time

    # Add possible times, filtering where a reservation already exists OR where
    # user already has a reservation on that date
    while current < end_time:
        if current not in existing_reservation_times and current.date() not in user_reservation_dates:
            times.append(current)
        current = current + timedelta(minutes=30)
    return times


def connect_to_db(app):

    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///reservations'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = True

    db.app = app
    db.init_app(app)

    print('Connected to database!')


if __name__ == '__main__':
    from server import app

    connect_to_db(app)
    db.create_all()
