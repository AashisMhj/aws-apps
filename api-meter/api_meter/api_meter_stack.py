from aws_cdk import (
    Stack,
    aws_dynamodb as dynamodb,
    RemovalPolicy,
    aws_lambda as _lambda,
    aws_apigateway as apigw,
    Duration,
    CfnOutput
)
from constructs import Construct
import os
# PROXY_API = os.getenv('PROXY_API')


class ApiMeterStack(Stack):

    def __init__(self, scope: Construct, construct_id: str,proxy_url, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # API Gateway declaration
        proxy_api_gw = apigw.RestApi(self, "CountryProxyApi")

        # Dynamodb Tables
        user_table = dynamodb.Table(
            self, "UserTable",
            partition_key=dynamodb.Attribute(
                name="username",
                type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="created-at",
                type=dynamodb.AttributeType.NUMBER
            ),
            removal_policy=RemovalPolicy.DESTROY
        )
        user_table.add_global_secondary_index(
            index_name="APIToken",
            partition_key=dynamodb.Attribute(
                name="api-token",
                type=dynamodb.AttributeType.STRING
            )
        )

        api_log = dynamodb.Table(
            self, "ApiLog",
            partition_key=dynamodb.Attribute(
                name="api-token",
                type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name="created-at",
                type=dynamodb.AttributeType.NUMBER
            ),
            removal_policy=RemovalPolicy.DESTROY
        )

        # Lambda Layer
        requests_layer = _lambda.LayerVersion(
            self, "RequestsLayer",
            code=_lambda.Code.from_asset("api_meter/lambda/requests_layer.zip"),
            compatible_runtimes=[_lambda.Runtime.PYTHON_3_14],
            description="Python requests layer"
        )
        # Authorizer 
        auth_fn = _lambda.Function(
            self, "AuthorizerFunction",
            runtime=_lambda.Runtime.PYTHON_3_14,
            handler="authorizer.handler",
            code=_lambda.Code.from_asset("api_meter/lambda/authorizer"),
            environment={
                "USER_TABLE_NAME": user_table.table_name,
                "API_LOG_TABLE": api_log.table_name,
            }
        )
        user_table.grant_read_data(auth_fn)
        api_log.grant_read_data(auth_fn)
        
        authorizer = apigw.RequestAuthorizer(
            self, "ApiAuthorizer",
            handler=auth_fn,
            identity_sources=[apigw.IdentitySource.query_string("token")],
            results_cache_ttl=Duration.seconds(0)
        )

        ## Lambdas
        # Register Lambda
        register_handler = _lambda.Function(
            self, "AuthHandler",
            runtime=_lambda.Runtime.PYTHON_3_14,
            code=_lambda.Code.from_asset("api_meter/lambda/register"),
            handler="register.handler",
            environment={
                "TABLE_NAME": user_table.table_name,
                "PROXY_API": proxy_url
            }
        )
        user_table.grant_read_write_data(register_handler)
       

        # Proxy Lambda
        proxy_fn = _lambda.Function(
            self, "ProxyFunction",
            runtime=_lambda.Runtime.PYTHON_3_14,
            handler="proxy.handler",
            code=_lambda.Code.from_asset("api_meter/lambda/proxy"),
            environment={
                "LOG_TABLE_NAME": api_log.table_name,
                "PROXY_API": proxy_url,
                "API_LIMIT": '10'


            },
            layers=[requests_layer]
        )
        user_table.grant_read_data(proxy_fn)
        api_log.grant_read_write_data(proxy_fn)

        # Info Lambda
        user_info_fn = _lambda.Function(
            self, "UserInfoFunction",
            runtime=_lambda.Runtime.PYTHON_3_14,
            handler="user-info.handler",
            code=_lambda.Code.from_asset("api_meter/lambda/user-info"),
            environment={
                "LOG_TABLE_NAME": api_log.table_name,
                "USER_TABLE": user_table.table_name
            }
        )
        user_table.grant_read_data(user_info_fn)
        api_log.grant_read_data(user_info_fn)

        # Configure API gateway
        register = proxy_api_gw.root.add_resource("register")
        register.add_method("POST", apigw.LambdaIntegration(register_handler))

        resource  = proxy_api_gw.root.add_resource("data")
        proxy_api = resource.add_resource("{url+}")
        proxy_api.add_method("GET", apigw.LambdaIntegration(proxy_fn), authorizer=authorizer)


        user_info_api = proxy_api_gw.root.add_resource("user-info")
        user_info_api.add_method("GET", apigw.LambdaIntegration(user_info_fn), authorizer=authorizer)
