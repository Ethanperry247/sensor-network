import threading
import time
import datetime
from flask import Flask, render_template, redirect, url_for, request, session
# from main import Network
app = Flask(__name__)
app.secret_key = '\xb0/P\x7f\x9e\xfe\xc2\x14\x1bx\xfe.\xa6\xae\xaaL\x8f\xe3\xd6\x8c\xbfq\xb6Rh\xd1\\\xb4\xa9}\xaa'


def authenticate_user(username, password):
    return True

@app.route("/")
def login():
    return render_template('login.html')

@app.route("/login", methods=['POST', 'GET'])
def login_status():
    
    # Obtain the username and password of the user.
    username = ''
    password = ''
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
    if ('username' in session or authenticate_user(username, password)):
        return redirect(url_for('index'))
    else:
        return "Invalid Username or Password."


@app.route("/main")
def index():
    now = datetime.datetime.now()
    timeString = now.strftime("%Y-%m-%d %H:%M")
    templateData = {
      'title' : 'HELLO!',
      'time': timeString,
      'nodes': {
          63: ['Relay', 'red', 'Offline'],
          24: ['Sensor', 'green', 'Online'],
      },
      'status': ['green', 'ONLINE'],
    }
    return render_template('index.html', **templateData)


@app.route("/MAIN/<action>")
def action(action):
    if (action == 'ALERT'):
        print(" * ALERT TRIGGERED MANUALLY!")
    if (action == 'OFF'):
        print(" * Clicked Off!")
    if (action == 'EXIT'):
        print(" * EXITING SERVER")
        exit(0)
    return redirect(url_for('index'))