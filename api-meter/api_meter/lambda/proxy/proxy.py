import json
import requests
import os
from datetime import datetime
import boto3
from urllib.parse import urlencode
from datetime import datetime, timezone, time
from boto3.dynamodb.conditions import Key


PROXY_URL = os.getenv('PROXY_API')
dynamodb = boto3.resource('dynamodb')
api_log_table = dynamodb.Table(os.environ['LOG_TABLE_NAME'])
api_limit = int(os.environ['API_LIMIT'])



def get_current_day_count(api_token):
    # 1. Get the current date in UTC
    now = datetime.now(timezone.utc)
    
    # 2. Get Start of Day (00:00:00)
    start_of_day = datetime.combine(now.date(), time.min).replace(tzinfo=timezone.utc)
    start_ts = int(start_of_day.timestamp())
    
    # 3. Get End of Day (23:59:59)
    # We add 86,399 seconds to the start of the day
    end_ts = start_ts + 86399
    
    # 4. Query DynamoDB using the dynamic range
    response = api_log_table.query(
        KeyConditionExpression=Key('api-token').eq(api_token) & 
                               Key('created-at').between(start_ts, end_ts),
        Select='COUNT'
    )
    
    return response.get('Count', 0)



def handler(event, context):
    url_param = event.get('pathParameters', {}).get('url')
    api_token = event.get('queryStringParameters', {}).get('token')
    query_params = event.get('queryStringParameters', {})
    del query_params['token']
    today_count = get_current_day_count(api_token)

    if today_count >= api_limit:
        return {
            "statusCode": 429,
            "body": "API limit exceeded. Please try again later.",
            "headers": {
                "Content-Type": "application/json"
            }
        }
    response = requests.get(f"{PROXY_URL}{url_param}?{urlencode(query_params)}")
    current_timestamp = datetime.now().timestamp()
    api_log_table.put_item(
        Item={
            'api-token': api_token,
            'created-at': int(current_timestamp),
            'response-code': response.status_code
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