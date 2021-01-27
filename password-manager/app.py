from flask import Flask, render_template, request, send_from_directory
from authentication.create_account import store_credentials
from config import addresses
import os

app = Flask(__name__)
address = addresses['l']


@app.route('/favicon.ico')
def return_icon():
    return send_from_directory(os.path.join(app.root_path, 'static/images'), 'secured-lock.png')

@app.route('/')
def landing_page():
    return render_template('landing-page.html', link=address)


@app.route('/signup', methods=['GET', 'POST'])
def signup_page():
    if request.method == 'POST':  # First step should be server-side password validation/form fuzzing (TBC)
        username, password = request.form['username'], request.form['password']
        if store_credentials(username, password) is False:
            return render_template('signup-page.html', error='Username is unavailable.', link=address)
        else:
            return render_template('/signup-successful.html', uname=username, link=address)
    return render_template('signup-page.html', error='', link=address)


if __name__ == '__main__':
    app.run()
