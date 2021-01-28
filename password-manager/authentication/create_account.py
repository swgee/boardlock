import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime
import bcrypt
from cryptography.fernet import Fernet
import csv

top_row = ["Title", "Password", "URL", "Notes"]

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('boardlock-data')

def store_credentials(username, password):
    response = table.query(
        KeyConditionExpression=Key('username').eq(username)
    )
    if len(response['Items']) > 0:
        return False
    else:
        password = bytes(password)
        salt = bcrypt.gensalt()
        auth_key = bcrypt.hashpw(password, salt)
        kek = bcrypt.kdf(password, salt, 32, 100)
        data_key = Fernet.generate_key()
        with open('quotes.csv', 'w', newline='') as new_csv:
            writer = csv.writer(new_csv, quoting=csv.QUOTE_NONNUMERIC, delimiter=';')
            writer.writerows(top_row)
        data_encrypt = Fernet(data_key)
        new_csv = bytes(new_csv)
        encrypted_csv = data_encrypt.encrypt(new_csv)
        key_encrypt = Fernet(kek)
        encrypted_data_key = key_encrypt.encrypt(data_key)
        table.put_item(
            Item={
                'username': username,
                'auth_key': auth_key,
                'salt': salt,
                'csv': encrypted_csv,
                'data_key': encrypted_data_key,
                'time_created': datetime.now().strftime("%m/%d/%Y %H:%M:%S"),
            }
        )
