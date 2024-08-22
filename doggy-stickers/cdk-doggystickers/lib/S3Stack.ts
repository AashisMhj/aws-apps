import {CfnOutput, RemovalPolicy, Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class S3Stack extends Stack{
    constructor(scope: Construct, id: string, props: StackProps){
        super(scope, id, props);

        const myBucket = new s3.Bucket(this, 'FileBucket', {
            bucketName: process.env.AWS_BUCKET,
            versioned: false,
            removalPolicy: RemovalPolicy.DESTROY, // Might want to change this if using in real app
            autoDeleteObjects: true,
            blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
            objectOwnership: s3.ObjectOwnership.BUCKET_OWNER_PREFERRED
        });

        myBucket.addCorsRule({
            allowedOrigins: ['http://locahost:300'],
            allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT],
            allowedHeaders: ['*'],
            exposedHeaders: ['ETag'],
            maxAge: 3000, //cache the cors for 3000 seconds
        });

        new CfnOutput(this, 'BucketName', {
            value: myBucket.bucketName,
            description: 'Bucket name'
        })
    }
}