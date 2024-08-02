#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkCognitoSetupStack } from '../lib/cdk-cognito-setup-stack';

const app = new cdk.App();
new CdkCognitoSetupStack(app, 'CdkCognitoSetupStack');
