import boto3
from boto3.dynamodb.conditions import Key
import bcrypt
from io import BytesIO
from cryptography.fernet import Fernet
from base64 import urlsafe_b64encode

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('boardlock-account-data')
s3 = boto3.client('s3')

def sign_user_in(username, password):
    response = table.query(KeyConditionExpression=Key('username').eq(username))
    if len(response['Items']) > 0:
        if check_password(response, password) is True:
            return retrieve_user_data(username, password, response)

def retrieve_user_data(username, password, response):
    data_key = response['Items'][0]['data_key'].value.decode('utf-8').encode('utf-8')
    salt = response['Items'][0]['salt'].value.decode('utf-8').encode('utf-8')
    buffer = BytesIO()
    s3.download_fileobj('boardlock-user-data', username, buffer)
    password = bytes(password, encoding='utf-8')
    kek = bcrypt.kdf(password, salt, 32, 100)
    key_encrypt = Fernet(urlsafe_b64encode(kek))
    data_key = key_encrypt.decrypt(data_key)
    data_encrypt = Fernet(data_key)
    user_data = data_encrypt.decrypt(buffer.getvalue())
    return user_data.decode('utf-8')

def check_password(response, password):
    auth_key = response['Items'][0]['auth_key']
    auth_key = auth_key.value.decode('utf-8').encode('utf-8')  # https://github.com/boto/boto3/issues/846
    salt = response['Items'][0]['salt']
    salt = salt.value.decode('utf-8').encode('utf-8')
    password = bytes(password, encoding='utf-8')
    if bcrypt.hashpw(password, salt) == auth_key:
        return True
