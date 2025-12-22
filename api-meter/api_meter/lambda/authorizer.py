import boto3
dynamodb = boto3.resource("dynamodb")
users_table = dynamodb.Table("users-table")



def handler(event, context):
    api_token = event.get("api-token", "")

    if not api_token:
        raise Exception("Unauthorized")
    
    # perform a database check
    response = users_table.get_item(
        key={
            'partition_key': 'value'
        }
    )

    return {
        ""
    }