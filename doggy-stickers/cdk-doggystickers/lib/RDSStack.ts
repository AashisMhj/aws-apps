import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class RDSStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const defaultVpc = ec2.Vpc.fromLookup(this, 'defaultVpc', {isDefault: true});

    const dbCredentialsSecret = new secretsmanager.Secret(this, 'DBCredentialsSecret', {
        secretName: 'rds-postgres-credentials',
        generateSecretString: {
            secretStringTemplate: JSON.stringify({username: 'root'}),
            excludePunctuation: true,
            includeSpace: false,
            generateStringKey: 'password'
        },
    });

    const securityGroup = new ec2.SecurityGroup(this, 'RdsSecurityGroup', {
        vpc: defaultVpc,
        allowAllOutbound: true
    });

    securityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(5432), 'Allow PostgresSQl');

    const rdsInstance = new rds.DatabaseInstance(this, 'RdsInstance', {
        engine: rds.DatabaseInstanceEngine.postgres({
            version: rds.PostgresEngineVersion.VER_16_3
        }),
        vpc: defaultVpc,
        credentials: rds.Credentials.fromSecret(dbCredentialsSecret),
        vpcSubnets: {
            subnetType: ec2.SubnetType.PUBLIC
        },
        securityGroups: [securityGroup],
        multiAz: false,
        allocatedStorage: 20,
        maxAllocatedStorage: 30,
        instanceType: ec2.InstanceType.of(
            ec2.InstanceClass.T3,
            ec2.InstanceSize.MICRO
        ),
        databaseName: 'dbdoggy',
        storageEncrypted: false,
        backupRetention: cdk.Duration.days(1),
        deleteAutomatedBackups: true,
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        deletionProtection: false,
        publiclyAccessible: true
    });

    new cdk.CfnOutput(this, 'DBInstanceEndpoint', {
        value: rdsInstance.instanceEndpoint.socketAddress
    });

    new cdk.CfnOutput(this, 'DBSecretName', {
        value: dbCredentialsSecret.secretName
    })

  }
}
