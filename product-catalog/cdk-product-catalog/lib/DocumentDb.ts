import { CfnOutput, RemovalPolicy, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as docdb from 'aws-cdk-lib/aws-docdb';

export class DocumentDBStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);
        const defaultVPC = ec2.Vpc.fromLookup(this, 'defaultVPC', { isDefault: true });
        const dbSecurityGroup = new ec2.SecurityGroup(this, 'DocDBSecurityGroup', {
            vpc: defaultVPC,
            allowAllOutbound: true,
            description: 'Security Group for document DB',
        });
        dbSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.allTraffic(), 'Allow all traffic for IPv4');
        dbSecurityGroup.addIngressRule(ec2.Peer.anyIpv6(), ec2.Port.allTraffic(), 'Allow all traffic for IPv4');

        // const cluster = new docdb.CfnDBCluster(this, 'DocDBCluster', {
        //     masterUsername: process.env.DB_USERNAME,
        //     masterUserPassword: process.env.DB_PASSWORD,
        //     vpcSecurityGroupIds: [dbSecurityGroup.securityGroupId],
        //     dbSubnetGroupName: new docdb.CfnDBSubnetGroup(this, 'DocDBDSubnetGroup', {
        //       dbSubnetGroupDescription: 'Subnet group for DocumentDB',
        //       subnetIds: newVPC.publicSubnets.slice(0,2).map(subnet => subnet.subnetId)
        //     }).ref,
        //     availabilityZones: newVPC.availabilityZones.slice(0,2),
        //     storageEncrypted: true
        //   });
      
          // Not able to create cluster
          // new docdb.CfnDBInstance(this, 'MyDocDbInstance', {
          //   dbClusterIdentifier: cluster.ref,
          //   dbInstanceClass: ec2.InstanceClass.T3
          // })

        const cluster = new docdb.DatabaseCluster(this, 'DocumentDBCluster', {
            masterUser: {
                username: process.env.DB_USERNAME || 'root',
                excludeCharacters: '"@/',
                secretName: process.env.DB_PASSWORD
            },
            instanceType: ec2.InstanceType.of(
                ec2.InstanceClass.D3,
                ec2.InstanceSize.MEDIUM
            ),
            vpc: defaultVPC,
            securityGroup: dbSecurityGroup,
            instances: 1,
            removalPolicy: RemovalPolicy.DESTROY
        });

        cluster.connections.allowDefaultPortFromAnyIpv4('open to the world')

        new CfnOutput(this, 'ClusterEndpoint', {
            value: cluster.clusterEndpoint.socketAddress
        });

        new CfnOutput(this, 'ReaderEndpoint', {
            value: cluster.clusterEndpoint.socketAddress
        })
    }
}