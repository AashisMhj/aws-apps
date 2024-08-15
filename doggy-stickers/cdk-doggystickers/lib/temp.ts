import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CiCdPipelineStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Create an ECR Repository
    const ecrRepository = new ecr.Repository(this, 'EcrRepository', {
      repositoryName: 'my-docker-repo',
    });

    // Create a CodeCommit Repository
    const codeCommitRepo = new codecommit.Repository(this, 'CodeCommitRepo', {
      repositoryName: 'MyCodeRepo',
    });

    // Create a CodeBuild Project
    const codeBuildProject = new codebuild.PipelineProject(this, 'CodeBuildProject', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
        privileged: true, // Required for Docker builds
      },
      environmentVariables: {
        'ECR_REPO_URI': {
          value: ecrRepository.repositoryUri,
        },
        'IMAGE_TAG': {
          value: 'latest',
        },
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: '0.2',
        phases: {
          pre_build: {
            commands: [
              'echo Logging in to Amazon ECR...',
              'aws --version',
              '$(aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin $ECR_REPO_URI)',
            ],
          },
          build: {
            commands: [
              'echo Build started on `date`',
              'echo Building the Docker image...',
              'docker build -t $ECR_REPO_URI:latest .',
            ],
          },
          post_build: {
            commands: [
              'echo Build completed on `date`',
              'echo Pushing the Docker image to ECR...',
              'docker push $ECR_REPO_URI:latest',
              'echo Docker image successfully pushed to $ECR_REPO_URI:latest',
            ],
          },
        },
        artifacts: {
          files: ['**/*'],
        },
      }),
    });

    // Grant CodeBuild access to the ECR repository
    ecrRepository.grantPullPush(codeBuildProject);

    // Create a CodePipeline
    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'MyDockerPipeline',
      restartExecutionOnUpdate: true,
    });

    // Add the source stage
    const sourceOutput = new codepipeline.Artifact();
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new codepipeline_actions.CodeCommitSourceAction({
          actionName: 'CodeCommit',
          repository: codeCommitRepo,
          output: sourceOutput,
          branch: 'main', // Set your branch name
        }),
      ],
    });

    // Add the build stage
    const buildOutput = new codepipeline.Artifact();
    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'CodeBuild',
          project: codeBuildProject,
          input: sourceOutput,
          outputs: [buildOutput],
        }),
      ],
    });

    // Optional: Add deployment stage to deploy the Docker image to a service
  }
}

const app = new cdk.App();
new CiCdPipelineStack(app, 'CiCdPipelineStack');
