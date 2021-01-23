#!/bin/bash
export FLASK_APP=cyberpunk2021/password-manager/app.py
export FLASK_ENV=development
export FLASK_DEBUG=false
anaconda3/bin/python -m flask run --host=0.0.0.0 --port=5000
