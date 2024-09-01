import {Stack, StackProps} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';

export class ECSStack extends Stack{
    constructor(scope: Construct, id: string, props?: StackProps){
        super(scope, id, props);

        const defaultVpc = ec2.Vpc.fromLookup(this, 'defaultVPC', {isDefault: true});

        const cluster = new ecs.Cluster(this, 'StrapiCluster', {
            vpc: defaultVpc
        });

        const strapiRepository = ecr.Repository.fromRepositoryName(this, 'StrapiECR', 'strapi-doggy-stickers');

        const strapiTaskDefinition = new ecs.FargateTaskDefinition(this, 'StrapiTaskDefinition');

        const container = strapiTaskDefinition.addContainer('StrapiCotainer', {
            image: ecs.ContainerImage.fromEcrRepository(strapiRepository, 'latest'),
            memoryLimitMiB: 512,
            cpu: 256
        });

        container.addPortMappings({
            containerPort: 1337,
        });

        new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'StrapiFargateService', {
            cluster,
            taskDefinition: strapiTaskDefinition,
            publicLoadBalancer: true,
        })
    }
}