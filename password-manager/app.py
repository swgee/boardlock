from flask import Flask
from flask import render_template

app = Flask(__name__)


@app.route('/')
def landing_page():
    return render_template('landing-page.html')

@app.route('/generate')
def random_password():
    return render_template('password-generator.html')

if __name__ == '__main__':
    app.run()
