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


class ApiMeterStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # API Gateway declaration
        proxy_api = apigw.RestApi(self, "CountryProxyApi")

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

        # Authorizer 
        auth_fn = _lambda.Function(
            self, "AuthorizerFunction",
            runtime=_lambda.Runtime.PYTHON_3_14,
            handler="authorizer.handler",
            code=_lambda.Code.from_asset("api_meter/lambda"),
            environment={
                "TABLE_NAME": user_table.table_name
            }
        )
        authorizer = apigw.RequestAuthorizer(
            self, "ApiAuthorizer",
            handler=auth_fn,
            identity_sources=[apigw.IdentitySource.query_string("token")],
            results_cache_ttl=Duration.seconds(0)
        )

        # Register Lambda
        register_handler = _lambda.Function(
            self, "AuthHandler",
            runtime=_lambda.Runtime.PYTHON_3_14,
            code=_lambda.Code.from_asset("api_meter/lambda"),
            handler="register.handler",
            environment={
                "TABLE_NAME": user_table.table_name
            }
        )
        user_table.grant_write_data(register_handler)
       

        # Proxy Lambda
        proxy_fn = _lambda.Function(
            self, "ProxyFunction",
            runtime=_lambda.Runtime.PYTHON_3_14,
            handler="proxy.handler",
            code=_lambda.Code.from_asset("api_meter/lambda")
        )
        user_table.grant_read_data(proxy_fn)

        register = proxy_api.root.add_resource("register")
        register.add_method("POST", apigw.LambdaIntegration(register_handler))
        resource  = proxy_api.root.add_resource("data")
        resource.add_method("GET", apigw.LambdaIntegration(proxy_fn), authorizer=authorizer)
