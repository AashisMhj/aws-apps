import json
import uuid
import os
import boto3
from boto3.dynamodb.conditions import Key
from datetime import datetime

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def handler(event, context):
    body = json.loads(event.get('body', '{}'))
    username = body.get('username')
    
    if not username:
        return {"statusCode": 400, "body": json.dumps({"error": "Missing username"})}
    
    response = table.query(
        KeyConditionExpression=Key("username").eq(username),
        ScanIndexForward=False  # newest first (by created-at)
    )

    items = response.get("Items", [])
    if len(items) > 0 and items[0]: 
        return {
            "statusCode": 400,
            "body": json.dumps({
                "message": "Username already exists"
            })
        }

    # Generate a secure random token
    api_token = str(uuid.uuid4())
    current_timestamp = datetime.now().timestamp()


    # Store in DynamoDB
    a = table.put_item(Item={
        'username': username,
        'api-token': api_token,
        'created-at': int(current_timestamp)
    })

    print(a)

    return {
        "statusCode": 201,
        "body": json.dumps({
            "message": "User registered",
            "token": api_token
        })
    }