import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime
import bcrypt
from cryptography.fernet import Fernet
from base64 import urlsafe_b64encode
from io import BytesIO
import codecs
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('boardlock-account-data')
s3 = boto3.resource('s3')
bucket = s3.Bucket('boardlock-user-data')

filler = 'SpaceBook\tLukeBoardWalker\tUsetheforce456\twww.spacebook.com\tSocial Media\t5/4/1977 03:27'

def create_starting_csv():
    buffer = BytesIO()
    stream_writer = codecs.getwriter('utf-8')
    wrapper_file = stream_writer(buffer)
    wrapper_file.write(filler)
    return buffer.getvalue()

def generate_auth_data(password):
    # encrypt password
    password = bytes(password, encoding='utf-8')
    salt = bcrypt.gensalt()
    auth_key = bcrypt.hashpw(password, salt)

    # encrypt data
    data_key = Fernet.generate_key()
    data_encrypt = Fernet(data_key)
    blank_csv = data_encrypt.encrypt(create_starting_csv())

    # encrypted data key
    kek = bcrypt.kdf(password, salt, 32, 100)
    key_encrypt = Fernet(urlsafe_b64encode(kek))
    encrypted_data_key = key_encrypt.encrypt(data_key)

    return [auth_key, salt, encrypted_data_key, blank_csv]

def store_account_data(username, password):
    response = table.query(KeyConditionExpression=Key('username').eq(username))
    if len(response['Items']) == 0:
        auth = generate_auth_data(password)
        # send authentication data to DynamoDB
        table.put_item(
            Item={
                'username': username,
                'auth_key': auth[0],
                'salt': auth[1],
                'data_key': auth[2],
                'time_created': datetime.now().strftime("%m/%d/%Y %H:%M:%S"),
                'token_hash': ''
            }
        )
        # send encrypted user data file to S3
        bucket.put_object(Body=auth[3], Key=username)
        return True
