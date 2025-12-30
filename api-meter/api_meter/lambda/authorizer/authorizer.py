import boto3
import os
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource("dynamodb")
users_table = dynamodb.Table(os.environ['USER_TABLE_NAME'])
api_log_table = dynamodb.Table(os.environ['API_LOG_TABLE'])

def handler(event, context):
    api_token = event.get("queryStringParameters", {}).get('token')
    method_arn = event['methodArn']

    if not api_token:
        raise Exception("Unauthorized")
    
    user_res = users_table.query(IndexName='APIToken', KeyConditionExpression=Key('api-token').eq(api_token))
    users = user_res.get('Items', None)
    effect = 'Allow' if users and users[0] else 'Deny'

    return {
        "principalId": "user",
        "policyDocument": {
            "Version": "2012-10-17",
            "Statement": [{
                "Action": "execute-api:Invoke",
                "Effect": effect,
                "Resource": method_arn
            }]
        }
    }