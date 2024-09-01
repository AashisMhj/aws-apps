import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { RDSStack } from './RDSStack';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as ecr from 'aws-cdk-lib/aws-ecr';
import * as dotenv from 'dotenv';
import { S3Stack } from './S3Stack';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

dotenv.config();

export class CdkDoggystickersStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const envProps:cdk.StackProps = {
      env: {
        account: process.env.AWS_ACCOUNT_ID,
        region: process.env.AWS_REGION
      }
    }

    new S3Stack(this, 'S3Stack', envProps)

    new RDSStack(this, 'RDSStack', envProps);

    const strapiEcrRepo = new ecr.Repository(this, 'StrapiRepo', { repositoryName: 'strapi-doggy-stickers' });
    const nextjsEcrRepo = new ecr.Repository(this, 'NextjsRepo', { repositoryName: 'nextjs-doggy-stickers' });

    const strapiCodeRepo = codecommit.Repository.fromRepositoryName(this, 'StrapiCodeCommit', 'strapi-doggy-stickers');
    const nextjsCodeRepo = codecommit.Repository.fromRepositoryName(this, 'NextjsCodeCommit', 'nextjs-doggy-stickers');


    const buildOptions = (ecr_repo_uri: string, image_name: string, environmentVariables: { [key: string]: {value: string} }) => {
      const pipelineConfig:codebuild.PipelineProjectProps ={
        environment: {
          buildImage: codebuild.LinuxBuildImage.AMAZON_LINUX_2_4,
          privileged: true, // Required for Docker builds
        },
        environmentVariables: {
          ...environmentVariables,
          'ECR_REPO_URI': { value: ecr_repo_uri, },
          'IMAGE_TAG': { value: 'latest', },
          'IMAGE_NAME': { value: image_name }
        },
        buildSpec: codebuild.BuildSpec.fromObject({
          version: 0.2,
          phases: {
            pre_build: {
              commands: [
                'echo "Pre Build phase"',
                'echo $ECR_REPO_URI',
                'aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin $ECR_REPO_URI',
              ],
            },
            build: {
              commands: [
                'echo Build started on `date`',
                'echo Building the Docker image...',
                'docker build -t $IMAGE_NAME:latest .',
                'docker tag $IMAGE_NAME $ECR_REPO_URI/$IMAGE_NAME:latest'
              ],
            },
            post_build: {
              commands: [
                'echo Build completed on `date`',
                'echo Pushing the Docker image to ECR...',
                'docker push $ECR_REPO_URI/$IMAGE_NAME:latest',
                'echo Docker image successfully pushed to $ECR_REPO_URI/$IMAGE_NAME:latest',
              ],
            },
          },
          artifacts: {
            files: ['**/*'],
          },
        }),
      }
      return pipelineConfig;
    }

    // Create a CodeBuild Project
    const strapiBuildProject = new codebuild.PipelineProject(this, 'StrapiBuild',
      buildOptions(cdk.Fn.select(0, cdk.Fn.split('/', strapiEcrRepo.repositoryUri)), 'strapi-doggy-stickers', {
        PORT: {value:  '80'},
        APP_KEYS: {value:  process.env.APP_KEYS || ''},
        API_TOKEN_SALT: {value:  process.env.API_TOKEN_SALT || ''},
        ADMIN_JWT_SECRET: {value:  process.env.ADMIN_JWT_SECRET || ''},
        TRANSFER_TOKEN_SALT: {value:  process.env.TRANSFER_TOKEN_SALT || ''},
        DATABASE_CLIENT: {value:  'postgres'},
        DATABASE_HOST: {value:  'TODO change' },
        DATABASE_PORT: {value:  "5432"},
        DATABASE_NAME: {value:  process.env.DATABASE_NAME || ''},
        DATABASE_USERNAME: {value:  process.env.DATABASE_USERNAME || ''},
        DATABASE_PASSWORD: {value:  'TO SET'},
        DATABASE_SSL: {value:  "false"},
        JWT_SECRET: {value:  process.env.JWT_SECRET || ''},
        NODE_ENV: {value: "production"},
        AWS_BUCKET: {value: process.env.AWS_BUCKET || ''},
      })
    );
    const nextjsBuildProject = new codebuild.PipelineProject(this, 'NextjsBuild',
      buildOptions(cdk.Fn.select(0, cdk.Fn.split('/', nextjsEcrRepo.repositoryUri)), 'nextjs-doggy-stickers', {
        NEXT_PUBLIC_API_URL: { value: process.env.NEXT_PUBLIC_API_URL || ''},
        API_TOKEN:{ value: process.env.API_TOKEN || ''},
      })
    );

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
