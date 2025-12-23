import boto3
import os

dynamodb = boto3.resource("dynamodb")
users_table = dynamodb.Table(os.environ['TABLE_NAME'])



def handler(event, context):
    api_token = event.get("api-queryStringParameters", {}).get('token')
    method_arn = event['methodArn']

    if not api_token:
        raise Exception("Unauthorized")
    

    
    # perform a database check
    response = users_table.scan(
        FilterExpression=boto3.dynamodb.conditions.Attr('api_token').eq(api_token)

    )
    effect = 'Allow' if response['Items'] else 'Deny'

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