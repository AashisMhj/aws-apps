import { Duration, Stack, StackProps, CfnOutput, RemovalPolicy } from 'aws-cdk-lib';
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as logs from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import data from './data'

export class CdkCognitoSetupStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const positionCustomAttribute = new cognito.StringAttribute({
      minLen: 1,
      maxLen: 300,
      mutable: true,
    })

    const userPool = new cognito.UserPool(this, 'UserPool', {
      userPoolName: 'DeadPool',
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
      },
      autoVerify: {
        email: false,
        phone: false
      },
      mfa: cognito.Mfa.OFF,
      passwordPolicy: {
        minLength: 8,
        requireLowercase: false,
        requireUppercase: false,
        requireDigits: false,
        requireSymbols: false
      },
      accountRecovery: cognito.AccountRecovery.NONE,
      standardAttributes: {
        address: { required: true, mutable: true },
        birthdate: { required: true, mutable: false }
      },
      customAttributes: {
        position: positionCustomAttribute
      }
    });

    const userPoolClient = new cognito.UserPoolClient(this, 'UserPoolClient', {
      userPool,
      generateSecret: false,
      authFlows: {
        userPassword: true
      }
    });

    const api = new apigateway.RestApi(this, 'RestApi', {
      restApiName: 'CognitoApi'
    });

    const authorizer = new apigateway.CognitoUserPoolsAuthorizer(this, 'CognitoAuthorizer', {
      cognitoUserPools: [userPool]
    });

    const staticResponse = api.root.addResource('static-Response');
    staticResponse.addMethod('GET', new apigateway.MockIntegration({
      integrationResponses: [
        {
          statusCode: '200',
          responseTemplates: {
            'application/json': JSON.stringify({data})
          }
        }
      ],
      requestTemplates: {
        'application/json': '{"statusCode": 200}'
      }
    }), {
      authorizer,
      authorizationType: apigateway.AuthorizationType.COGNITO,
      methodResponses: [{ statusCode: '200' }]
    });

    const logGroup = new logs.LogGroup(this, 'LogGroup', {
      logGroupName: '/aws/cd/log-group',
      retention: logs.RetentionDays.FIVE_DAYS,
      removalPolicy: RemovalPolicy.DESTROY
    });

    const logStream = new logs.LogStream(this, 'LogStream', {
      logGroup: logGroup,
      logStreamName: 'my-log-steam',
      removalPolicy: RemovalPolicy.DESTROY
    });

    new CfnOutput(this, 'UserPoolId', {
      value: userPool.userPoolId
    });
    new CfnOutput(this, 'UserPoolClientId', {
      value: userPoolClient.userPoolClientId
    });
    new CfnOutput(this, 'Api', {
      value: api.url
    });

    new CfnOutput(this, 'LogSteam', {
      value: logGroup.logGroupName
    })
  }
}
