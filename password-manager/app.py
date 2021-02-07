from flask import Flask, render_template, request, send_from_directory, redirect, session
from create_account import store_account_data
from authentication import create_token, check_token, delete_token
from config import addresses, secret_key
import os
from encryption import update_data, retrieve_data, change_password


app = Flask(__name__)

address = addresses['l']
app.secret_key = secret_key
app.config['SESSION_COOKIE_SECURE'] = True
# Flask session httpOnly set to True by default

@app.route('/favicon.ico')
def return_icon():
    return send_from_directory(os.path.join(app.root_path, 'static/images'), 'secured-lock.png')

@app.route('/', methods=['GET', 'POST'])
def landing_page():
    if 'token' in session.keys() and 'username' in session.keys() and 'kek' in session.keys():
        return redirect('/manager')
    if request.method == 'POST':
        username, password = request.form['username'], request.form['password']
        auth_data = create_token(username, password)  # returns None if wrong login
        if auth_data is not None:
            session['username'] = username
            session['token'] = auth_data[0]
            session['kek'] = auth_data[1]
            return redirect('/manager')
        else:
            return render_template('landing-page.html', error='Invalid credentials.', link=address)
    return render_template('landing-page.html', link=address)

@app.route('/signup', methods=['GET', 'POST'])
def signup_page():
    if request.method == 'POST':
        username, password = request.form['username'], request.form['password']
        if store_account_data(username, password) is True:
            return render_template('/signup-successful.html', uname=username, link=address)
        else:
            return render_template('signup-page.html', error='Username is unavailable.', link=address)
    return render_template('signup-page.html', error='', link=address)

@app.route('/manager', methods=['GET', 'POST'])
def manager():
    if 'username' in session.keys() and 'token' in session.keys() and 'kek' in session.keys():
        if check_token(session['username'], session['token']):
            if request.method == 'POST':
                data = request.form['data']
                return render_template('/manager.html', username=session['username'], data=update_data(data, session['username'], session['kek']), link=address)
            else:
                return render_template('/manager.html', username=session['username'], data=retrieve_data(session['username'], session['kek']), link=address)
        else:
            session.pop('username'), session.pop('token'), session.pop('kek')
            return redirect('/')
    else:
        return redirect('/')

@app.route('/change-root', methods=['GET', 'POST'])
def change_root():
    if 'username' in session.keys():
        if request.method == 'POST':
            old_password = request.form['old']
            new_password = request.form['password']
            kek = change_password(session['username'], session['kek'], old_password, new_password)
            if kek is not None:
                session['kek'] = kek
                return render_template('/change_successful.html', link=address)
            else:
                return render_template('/change_root.html', error='Root Password Incorrect', link=address)
        else:
            return render_template('/change_root.html', error='', link=address)
    else:
        return redirect('/')

@app.route('/logout')
def logout():
    if 'username' in session.keys() and 'token' in session.keys() and 'kek' in session.keys():
        if check_token(session['username'], session['token']):
            delete_token(session['username'])
            session.pop('username'), session.pop('token'), session.pop('kek')
            return redirect('/')
        else:
            return redirect('/')
    else:
        return redirect('/')


if __name__ == '__main__':
    app.run()
