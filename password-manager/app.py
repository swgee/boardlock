from flask import Flask, render_template, request, send_from_directory
from authentication.createaccount import *
import os

app = Flask(__name__)

@app.route('/favicon.ico')
def return_icon():
    return send_from_directory(os.path.join(app.root_path, 'static/images'), 'secured-lock.png')

@app.route('/')
def landing_page():
    return render_template('landing-page.html')

@app.route('/signup', methods=['GET', 'POST'])
def signup_page():
    if request.method == 'POST':  # First step should be server-side password validation/form fuzzing (TBC)
        username, password = request.form['username'], request.form['password']
        if username_available(username) is True:
            store_credentials(username, password)
        else:
            return render_template('signup-page.html', error='Username is unavailable.')
    return render_template('signup-page.html', error='')


if __name__ == '__main__':
    app.run()
