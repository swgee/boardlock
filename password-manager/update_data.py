from flask import session
from datetime import datetime
import boto3
from boto3.dynamodb.conditions import Key
import bcrypt
from cryptography.fernet import Fernet
from io import BytesIO
from base64 import urlsafe_b64encode
import codecs

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('boardlock-account-data')
s3 = boto3.resource('s3')
bucket = s3.Bucket('boardlock-user-data')

def new_entry(form):
    # add to session['user-data']
    username = session['username']
    password = session['password']
    new_row = ''
    for field in form.keys():
        if field != 'change_type':
            new_row += form[field] + '\t'
    new_row += datetime.now().strftime("%m/%d/%Y %H:%M:%S") + '\n'
    session['data'] += new_row

    # retrieve data encryption key
    response = table.query(KeyConditionExpression=Key('username').eq(username))

    # encrypt new data
    data_key = response['Items'][0]['data_key'].value.decode('utf-8').encode('utf-8')
    salt = response['Items'][0]['salt'].value.decode('utf-8').encode('utf-8')
    password = bytes(password, encoding='utf-8')
    kek = bcrypt.kdf(password, salt, 32, 100)
    key_encrypt = Fernet(urlsafe_b64encode(kek))
    data_key = key_encrypt.decrypt(data_key)
    data_encrypt = Fernet(data_key)
    updated_data = data_encrypt.encrypt(data_to_bytes(session['data']))

    # replace file in S3
    bucket.put_object(Body=updated_data, Key=username)


def edit_entry(form):
    print(form)

def data_to_bytes(data):
    buffer = BytesIO()
    stream_writer = codecs.getwriter('utf-8')
    wrapper_file = stream_writer(buffer)
    wrapper_file.write(data)
    return buffer.getvalue()
