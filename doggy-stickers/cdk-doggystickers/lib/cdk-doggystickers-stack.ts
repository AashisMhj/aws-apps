import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RDSStack } from './RDSStack';
import * as dotenv from 'dotenv';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

dotenv.config();

export class CdkDoggystickersStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    new RDSStack(this, 'RDSStack', {
      env: {
        account: process.env.AWS_ACCOUNT_ID,
        region: process.env.AWS_REGION 
      }
    })
  }
}
