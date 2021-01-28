import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime
import bcrypt
from cryptography.fernet import Fernet
from base64 import urlsafe_b64encode
import pandas as pd
from io import BytesIO
import codecs

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('boardlock-account-data')
s3 = boto3.resource('s3')
bucket = s3.Bucket('boardlock-user-data')
s3 = boto3.client('s3')

user_filler_data = {
    'Username': ['LukeBoardWalker', 'user1977'],
    'Password': ['Forcelover456', 'hK+:VQhj8~y:aYwq'],
    'URL': ['www.spacebook.com', 'login.rebels.com'],
    'Category': ['Social Media', 'Work']
}
df = pd.DataFrame(data=user_filler_data)


''' Download data from S3
buffer = BytesIO()
s3.download_fileobj('boardlock-user-data', username, buffer)
print(repr(buffer.getvalue().decode('utf-8')))
'''


def create_blank_csv():
    buffer = BytesIO()
    stream_writer = codecs.getwriter('utf-8')
    wrapper_file = stream_writer(buffer)
    wrapper_file.write(df.to_csv(sep='\t'))
    return buffer.getvalue()

def store_credentials(username, password):
    response = table.query(
        KeyConditionExpression=Key('username').eq(username)
    )
    if len(response['Items']) > 0:
        return False
    else:
        # encrypt password
        password = bytes(password, encoding='utf-8')
        salt = bcrypt.gensalt()
        auth_key = bcrypt.hashpw(password, salt)
        # encrypt data
        data_key = Fernet.generate_key()
        data_encrypt = Fernet(data_key)
        blank_csv = create_blank_csv() # data_encrypt.encrypt(
        # encrypted data key
        kek = bcrypt.kdf(password, salt, 32, 100)
        key_encrypt = Fernet(urlsafe_b64encode(kek))
        encrypted_data_key = key_encrypt.encrypt(data_key)
        # send authentication data to DynamoDB
        table.put_item(
            Item={
                'username': username,
                'auth_key': auth_key,
                'salt': salt,
                'data_key': encrypted_data_key,
                'time_created': datetime.now().strftime("%m/%d/%Y %H:%M:%S"),
            }
        )
        # send encrypted user data file to S3
        bucket.put_object(Body=blank_csv, Key=username)
