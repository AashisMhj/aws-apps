import os
import boto3
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
api_log_table = dynamodb.Table(os.environ['LOG_TABLE_NAME'])
user_table = dynamodb.Table(os.environ['USER_TABLE'])

def handler(event, context):
    api_token = event.get("queryStringParameters", {}).get('token')
    user_res = user_table.query(
        IndexName='APIToken',
        KeyConditionExpression=Key('api-token').eq(api_token)
    )
    users = user_res.get('Items', [])
    user = users[0] if users else None
    api_count_res = api_log_table.query(
        keyConditionExpression=Key('api-token').eq(api_token)
    )
    api_count = api_count_res.get('Count', 0)
    return {
        'User': user,
        'Total Count': api_count
    }