import boto3
from boto3.dynamodb.conditions import Key
import bcrypt
from io import BytesIO
from cryptography.fernet import Fernet
from base64 import urlsafe_b64encode
import secrets
from hashlib import sha256


dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('boardlock-account-data')
s3 = boto3.client('s3')
s3r = boto3.resource('s3')
bucket = s3r.Bucket('boardlock-user-data')

def check_password(account, password):
    auth_key = account['auth_key']
    auth_key = auth_key.value
    salt = account['salt']
    salt = salt.value
    password = bytes(password, encoding='utf-8')
    if bcrypt.hashpw(password, salt) == auth_key:
        return True

def create_token(username, password):
    account = query_table(username)
    if check_password(account, password):
        token = secrets.token_bytes(64)
        token_hash = sha256(token).hexdigest()
        table.put_item(  # update_item not working
            Item={
                'username': account['username'],
                'auth_key': account['auth_key'],
                'salt': account['salt'],
                'data_key': account['data_key'],
                'time_created': account['time_created'],
                'token_hash': token_hash
            }
        )
        salt = account['salt'].value
        password = bytes(password, encoding='utf-8')
        kek = bcrypt.kdf(password, salt, 32, 100)
        return [token, kek]

def check_token(username, token):
    account = query_table(username)
    if sha256(token).hexdigest() == account['token_hash']:
        return True

def delete_token(username):
    account = query_table(username)
    table.put_item(  # update_item not working
        Item={
            'username': account['username'],
            'auth_key': account['auth_key'],
            'salt': account['salt'],
            'data_key': account['data_key'],
            'time_created': account['time_created'],
            'token_hash': ''
        }
    )

def query_table(username):
    response = table.query(KeyConditionExpression=Key('username').eq(username))
    return response['Items'][0]
