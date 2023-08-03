# Melon Reservation Scheduler

## Description
This project allows you to make and manage melon tasting reservations. 🍉

## Justification
I chose to use Flask because it is a lightweight web framework that is flexible and simple to implement. 
I used postgreSQL because it's a commonly used relational database and makes a good choice since every reservation has a consistent format.
SQLAlchemy allowed me to incorporate these two technologies using Python. 
On the front end, I built this page in React as a single page app because client side rendering provides a more seamless experience for the user. 

## Installation
To run Melon Reservation Schedule on your local machine, follow the instructions below (note: these instructions assume you have Postgres installed and running):

Clone this repo.

Create and activate a virtual environment inside your project directory:

```
virtualenv env (Mac OS)
virtualenv env --always-copy (Windows OS)
source env/bin/activate
```

Install the dependencies:
```pip3 install -r requirements.txt```

Create the database and tables by running the following commands: 
```
createdb melon_reservations 
python3 model.py
``` 

Run the app:
```python3 server.py```

You can now navigate to 'localhost:5000/' to access Melon Tasting Scheduler.
