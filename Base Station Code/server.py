import threading
from flask import Flask
app = Flask(__name__)

@app.route('/')
def index():
    return 'Welcome to the home page!'