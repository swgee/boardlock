from flask import session
from datetime import datetime
import boto3
from boto3.dynamodb.conditions import Key
import bcrypt
from cryptography.fernet import Fernet
from io import BytesIO
from base64 import urlsafe_b64encode
import codecs
from authentication import check_password

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
    if len(response['Items']) > 0:
        return response['Items'][0]

def change_password(username, kek, old_password, new_password):
    account = query_table(username)
    if account is not None:
        if check_password(account, old_password):
            data = retrieve_data(username, kek)
            # new salt and auth_key
            password = bytes(new_password, encoding='utf-8')
            salt = bcrypt.gensalt()
            auth_key = bcrypt.hashpw(password, salt)
            # re-encrypt data with new data key
            data_key = Fernet.generate_key()
            data_encrypt = Fernet(data_key)
            re_encrypted = data_encrypt.encrypt(data.encode('utf-8'))
            # new kek
            kek = bcrypt.kdf(password, salt, 32, 100)
            key_encrypt = Fernet(urlsafe_b64encode(kek))
            encrypted_data_key = key_encrypt.encrypt(data_key)
            # store new credentials
            table.put_item(
                Item={
                    'username': username,
                    'auth_key': auth_key,
                    'salt': salt,
                    'data_key': encrypted_data_key,
                    'time_created': account['time_created'],
                    'token_hash': ''
                }
            )
            # store data
            bucket.put_object(Body=re_encrypted, Key=username)
            return kek
