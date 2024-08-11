#!/usr/bin/env node
import * as cdk from 'aws-cdk-lib';
import { CdkProductCatalogStack } from '../lib/cdk-product-catalog-stack';
import * as dotenv from 'dotenv';

dotenv.config();

const app = new cdk.App();
new CdkProductCatalogStack(app, 'CdkProductCatalogStack', {
    env: {
        account: process.env.AWS_ACCOUNT_ID,
        region: process.env.AWS_REGION
    }
});
