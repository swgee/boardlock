import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime


dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('boardlock-data')

def store_credentials(username, password):
    response = table.query(
        KeyConditionExpression=Key('username').eq(username)
    )
    if len(response['Items']) == 0:
        table.put_item(
            Item={
                'username': username,
                'password': password,
                'time_created': datetime.now().strftime("%m/%d/%Y %H:%M:%S"),
            }
        )
    else:
        return False
