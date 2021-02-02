from flask import Flask, render_template, request, send_from_directory, redirect, session
from create_account import store_account_data
from login import sign_user_in
from config import addresses, secret_key
import os
from update_data import edit_entry, new_entry

app = Flask(__name__)
address = addresses['l']
app.secret_key = secret_key

@app.route('/favicon.ico')
def return_icon():
    return send_from_directory(os.path.join(app.root_path, 'static/images'), 'secured-lock.png')

@app.route('/', methods=['GET', 'POST'])
def landing_page():
    if 'username' in session.keys():
        return redirect('/manager')
    if request.method == 'POST':
        username, password = request.form['username'], request.form['password']
        query = sign_user_in(username, password)
        if query is not None:
            session['user-data'] = query
            session['username'] = username
            return redirect('/manager')
        else:
            return render_template('landing-page.html', error='Invalid credentials.', link=address)
    return render_template('landing-page.html', link=address)


@app.route('/signup', methods=['GET', 'POST'])
def signup_page():
    if request.method == 'POST':  # First step should be server-side password validation/form fuzzing (TBC)
        username, password = request.form['username'], request.form['password']
        if store_account_data(username, password) is True:
            return render_template('/signup-successful.html', uname=username, link=address)
        else:
            return render_template('signup-page.html', error='Username is unavailable.', link=address)
    return render_template('signup-page.html', error='', link=address)

@app.route('/manager', methods=['GET', 'POST'])
def manager():
    if request.method == 'POST':
        if request.form['change_type'] == 'edit':
            edit_entry()
        if request.form['change_type'] == 'new':
            new_entry()
    if 'username' in session.keys():
        return render_template('/manager.html', username=session['username'], data=session['user-data'], link=address)
    else:
        return redirect('/')

@app.route('/logout')
def logout():
    if 'username' in session.keys():
        session.pop('username')
    return redirect('/')

if __name__ == '__main__':
    app.run()
