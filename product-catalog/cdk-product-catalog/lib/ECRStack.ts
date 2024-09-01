import { CfnOutput, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as ec2 from 'aws-cdk-lib/aws-ec2';

export class ECRStack extends Stack {
    constructor(scope: Construct, id: string, props?: StackProps) {
        super(scope, id, props);

        const repo = codecommit.Repository.fromRepositoryName(this, 'ProductCatalogRepo', process.env.REPO_NAME || '');

        const ecrRepo = new ecr.Repository(this, 'ProductCatalogEcrRepo');

        const project = new codebuild.Project(this, 'ProductCatalogProject', {
            source: codebuild.Source.codeCommit({ repository: repo }),
            environment: {
                buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_4,
                privileged: true, // required to run docker
            },
            environmentVariables: {
                PORT: { value: process.env.PORT || '5000' },
                DB_URL: { value: process.env.DB_URL }, // TODO replace with url of document db created
                VITE_API_HOST: { value: process.env.VITE_API_HOST } // TODO replace with url of load balancer created
            },
            buildSpec: codebuild.BuildSpec.fromObject({
                version: '0.2',
                phases: {
                    pre_build: {
                        commands: [
                            'echo Logging in to Amazon ECR...',
                            'aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin $ECR_REPO_URI',
                        ],
                    },
                    build: {
                        commands: [
                            'echo Build started on `date`',
                            'echo Building the Docker image...',
                            'docker build -t product-catalog ./product-catalog',
                            'docker tag my-app:latest $ECR_REPO_URI:latest',
                        ],
                    },
                    post_build: {
                        commands: [
                            'echo Pushing the Docker image...',
                            'docker push $ECR_REPO_URI:latest',
                            'echo Build completed on `date`',
                        ],
                    },
                    artifacts: {
                        files: ['**/*'],
                    },
                },
            })
        });

        ecrRepo.grantPullPush(project.grantPrincipal);

        const defaultVPC = ec2.Vpc.fromLookup(this, 'defaultVPC', {isDefault: true});
        const cluster = new ecs.Cluster(this, 'ProductCatalogCluster', {vpc: defaultVPC});

        const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'MyFargateService', {
            cluster,
            taskImageOptions: {
                image: ecs.ContainerImage.fromEcrRepository(ecrRepo, 'latest'),
                containerPort: 80,
            },
            publicLoadBalancer: true
        });

        new CfnOutput(this, 'LoadBalancerDNS', {
            value: fargateService.loadBalancer.loadBalancerDnsName
        })

    }
}