import { Aws, Duration, Stack, StackProps } from 'aws-cdk-lib';
import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as eventSource from 'aws-cdk-lib/aws-lambda-event-sources';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as docdb from 'aws-cdk-lib/aws-docdb';
import { Construct } from 'constructs';
import { ECRStack } from './ECRStack';

export class CdkProductCatalogStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const newVPC = ec2.Vpc.fromLookup(this, 'defaultVPC', {isDefault: true});


    const myQueue = new sqs.Queue(this, 'MyQueue', {
      queueName: 'MyQueue',
      retentionPeriod: Duration.days(1),
      visibilityTimeout: Duration.seconds(50)
    });

    const insertPreOrderLambda = new lambda.Function(this, 'insertPreOrder', {
      runtime: lambda.Runtime.NODEJS_20_X,
      code: lambda.Code.fromAsset('lambda'),
      handler: 'index.handler',
      environment: {
        QUEUE_URL: myQueue.queueUrl,
        DB_USERNAME: process.env.DB_USERNAME || '',
        DB_PASSWORD: process.env.DB_PASSWORD || '',
        // DB_CLUSTER_ENDPOINT: cluster.attrEndpoint,
        // DB_CLUSTER_PORT: cluster.attrPort,
        DB_NAME: process.env.DB_NAME || 'product-catalog'
      }
    });

    insertPreOrderLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ['secretsmanager:GetSecretValue', 'kms:Decrypt'],
      resources: ['*']
    }));

    myQueue.grantConsumeMessages(insertPreOrderLambda);

    insertPreOrderLambda.addEventSource(new eventSource.SqsEventSource(myQueue));

    const api = new apigateway.RestApi(this, 'PreOrderAPI', {
      restApiName: 'PreOrder Api',
      description: 'Pre order Api'
    });

    const sqsIntegration = new apigateway.AwsIntegration({
      service: 'sqs',
      path: `${Aws.ACCOUNT_ID}/${myQueue.queueName}`,
      options: {
        integrationResponses: [{
          statusCode: '200',
          responseTemplates: {
            'application/json': '{"message": "Product Pre Ordered"}'
          }
        }],
        credentialsRole: new iam.Role(this, 'ApiGatewaySQSRole', {
          assumedBy: new iam.ServicePrincipal('apigateway.amazonaws.com'),
          managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSQSFullAccess')]
        }),
        requestParameters: {
          'integration.request.header.Content-Type': "'application/x-www-form-urlencoded'"
        },
        requestTemplates: {
          'application/json': 'Action=SendMessage&MessageBody=$input.body'
        }
      }
    });

    const postMessage = api.root.addResource('pre-order');
    postMessage.addMethod('POST', sqsIntegration, {
      methodResponses: [{statusCode: '200'}]
    });

    // new ECRStack(this, 'ECRStack', {
    //   env: {
    //     account: process.env.AWS_ACCOUNT_ID,
    //     region: process.env.AWS_REGION
    //   }
    // })
  }
}
