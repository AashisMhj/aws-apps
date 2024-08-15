import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RDSStack } from './RDSStack';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as iam from 'aws-cdk-lib/aws-iam';
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
    });

    const strapiEcrRepo = new ecr.Repository(this, 'StrapiRepo', { repositoryName: 'strapi-doggy-sticker' });
    const nextjsEcrRepo = new ecr.Repository(this, 'NextjsRepo', { repositoryName: 'nextjs-repo-stickers' });

    const strapiCodeRepo = codecommit.Repository.fromRepositoryName(this, 'StrapiCodeCommit', 'strapi-doggy-stickers');
    const nextjsCodeRepo = codecommit.Repository.fromRepositoryName(this, 'NextjsCodeCommit', 'nextjs-doggy-stickers');

    const buildOptions = (ecr_repo_uri: string) => (
      {
        environment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_5_0,
          privileged: true, // Required for Docker builds
        },
        environmentVariables: {
          'ECR_REPO_URI': {
            value: ecr_repo_uri,
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
                'echo "Pre Build phase"',
                'echo $ECR_REPO_URI',
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
      }
    )

    // Create a CodeBuild Project
    const strapiBuildProject = new codebuild.PipelineProject(this, 'StrapiBuild',buildOptions(strapiEcrRepo.repositoryUri));
    const nextjsBuildProject = new codebuild.PipelineProject(this, 'NextjsBuild',buildOptions(nextjsEcrRepo.repositoryUri));

    // Grant CodeBuild access to the ECR repository
    strapiEcrRepo.grantPullPush(strapiBuildProject);
    nextjsEcrRepo.grantPullPush(nextjsBuildProject);

    // Create a CodePipeline
    const strapiPipeline = new codepipeline.Pipeline(this, 'StrapiPipeline', {
      pipelineName: 'StrapiPipeline',
      restartExecutionOnUpdate: true,
    });
    const nextjsPipeline = new codepipeline.Pipeline(this, 'NextPipeline', {
      pipelineName: 'nextPipeline',
      restartExecutionOnUpdate: true,
    });


    // Add the source stage
    const sourceOutput = new codepipeline.Artifact();
    strapiPipeline.addStage({
      stageName: 'Source',
      actions: [
        new codepipeline_actions.CodeCommitSourceAction({
          actionName: 'CodeCommit',
          repository: strapiCodeRepo,
          output: sourceOutput,
          branch: 'main',
        }),
      ],
    });
    nextjsPipeline.addStage({
      stageName: 'Source',
      actions: [
        new codepipeline_actions.CodeCommitSourceAction({
          actionName: 'CodeCommit',
          repository: nextjsCodeRepo,
          output: sourceOutput,
          branch: 'main', 
        }),
      ],
    });
    

    // Add the build stage
    const buildOutput = new codepipeline.Artifact();
    strapiPipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'CodeBuild',
          project: strapiBuildProject,
          input: sourceOutput,
          outputs: [buildOutput],
        }),
      ],
    });
    nextjsPipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'CodeBuild',
          project: nextjsBuildProject,
          input: sourceOutput,
          outputs: [buildOutput],
        }),
      ],
    });


  }
}
