import json
import requests
import os
from datetime import datetime
import boto3

PROXY_URL = os.getenv('PROXY_API')
dynamodb = boto3.resource('dynamodb')
api_log_table = dynamodb.Table(os.environ['LOG_TABLE_NAME'])


def handler(event, context):
    url = event.get('pathParameters', {}).get('url')
    print(url)
    response = requests.get(f"{PROXY_URL}all?fields=name,flags")
    api_token = event.get('queryStringParameters', {}).get('token')
    current_timestamp = datetime.now().timestamp()
    api_log_table.put_item(
        Item={
            'api-token': api_token,
            'created-at': int(current_timestamp)
        }
    )
    if response.status_code == 200:
        
        return {
            "statusCode": 200,
            "body": json.dumps(response.json())
        }
    else:
        return {
            "statusCode": response.status_code,
            "body": json.dumps({"error": "External API error"})
        }