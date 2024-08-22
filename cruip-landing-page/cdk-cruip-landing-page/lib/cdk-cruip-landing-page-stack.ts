import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as codebuild from 'aws-cdk-lib/aws-codebuild';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as codepipeline from 'aws-cdk-lib/aws-codepipeline';
import * as codepipeline_actions from 'aws-cdk-lib/aws-codepipeline-actions';
import * as iam from 'aws-cdk-lib/aws-iam';

export class CdkCruipLandingPageStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const codeCommitRepo = codecommit.Repository.fromRepositoryName(this, 'CodeRepo', 'landing-page');
    const websiteBucket = new s3.Bucket(this,'WebsiteBucket', {
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: '404.html',
      blockPublicAccess: {
        blockPublicPolicy: false,
        blockPublicAcls: false,
        ignorePublicAcls: false,
        restrictPublicBuckets: false
      },
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      publicReadAccess: true,
      autoDeleteObjects: true
    });

    const buildProject = new codebuild.PipelineProject(this, 'NextJsBuild', {
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
      },
      environmentVariables: {
        'S3_BUCKET': {value: websiteBucket.bucketName}
      },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: 0.2,
        phases: {
          install: {
            commands: [
              'echo "installing pnpm"',
              'npm install -g pnpm',
              'pnpm install'
            ]
          },
          build: {
            commands: [
              'pnpm build'
            ]
          },
          post_build: {
            commands: [
              'aws s3 sync out/ s3://$S3_BUCKET --delete'
            ]
          }
        },
        artifacts: {
          files: "**/*",
          'base-directory': 'out'
        }
      })
    });

    const pipeline = new codepipeline.Pipeline(this, 'NextJsPipeline', {
      pipelineName: 'NextJsPipeline',
      restartExecutionOnUpdate: true,
    });

    // add permission for codebuild to upload to s3
    websiteBucket.grantReadWrite(buildProject);

    const sourceOutput = new codepipeline.Artifact();
    // source stage
    pipeline.addStage({
      stageName: 'Source',
      actions: [
        new codepipeline_actions.CodeCommitSourceAction({
          actionName: 'CodeCommit',
          repository: codeCommitRepo,
          output: sourceOutput,
          branch: 'main'
        })
      ]
    });

    const buildOutput = new codepipeline.Artifact();
    pipeline.addStage({
      stageName: 'Build',
      actions: [
        new codepipeline_actions.CodeBuildAction({
          actionName: 'CodeBuild',
          project: buildProject,
          input: sourceOutput,
          outputs: [buildOutput]
        })
      ]
    });

  }
}
