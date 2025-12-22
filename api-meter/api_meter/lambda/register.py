import json
import uuid
import os
import boto3

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table(os.environ['TABLE_NAME'])

def handler(event, context):
    body = json.loads(event.get('body', '{}'))
    username = body.get('username')
    
    if not username:
        return {"statusCode": 400, "body": json.dumps({"error": "Missing username"})}

    # Generate a secure random token
    api_token = str(uuid.uuid4())

    # Store in DynamoDB
    table.put_item(Item={
        'username': username,
        'api_token': api_token
    })

    return {
        "statusCode": 201,
        "body": json.dumps({
            "message": "User registered",
            "token": api_token
        })
    }