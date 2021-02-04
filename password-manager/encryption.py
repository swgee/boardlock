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
s3 = boto3.client('s3')
s3r = boto3.resource('s3')
bucket = s3r.Bucket('boardlock-user-data')

def retrieve_data(username, kek):
    # retrieve data_key
    account = query_table(username)
    data_key = account['data_key'].value
    # retrieve data
    buffer = BytesIO()
    s3.download_fileobj('boardlock-user-data', username, buffer)
    # decrypt data_key with kek and data with data_key
    key_encrypt = Fernet(urlsafe_b64encode(kek))
    data_key = key_encrypt.decrypt(data_key)
    data_encrypt = Fernet(data_key)
    user_data = data_encrypt.decrypt(buffer.getvalue())
    print(user_data.decode('utf-8'))
    return user_data.decode('utf-8')

def update_data(data, username, kek):
    # retrieve data encryption key
    account = query_table(username)
    # encrypt new data
    data_key = account['data_key'].value
    key_encrypt = Fernet(urlsafe_b64encode(kek))
    data_key = key_encrypt.decrypt(data_key)
    data_encrypt = Fernet(data_key)
    encrypted_data = data_encrypt.encrypt(data_to_bytes(data))
    # replace file in S3
    bucket.put_object(Body=encrypted_data, Key=username)
    return data

def data_to_bytes(data):
    buffer = BytesIO()
    stream_writer = codecs.getwriter('utf-8')
    wrapper_file = stream_writer(buffer)
    wrapper_file.write(data)
    return buffer.getvalue()

def query_table(username):
    response = table.query(KeyConditionExpression=Key('username').eq(username))
    return response['Items'][0]
