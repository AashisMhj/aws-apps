# CDK Product Catalog
CDK code to setup infrastructures for Product catalog app. 

## Prerequisite
- cdk
- aws account
**For the cdk infrastructure to setup it required you to manually setup a codecommit repository.**


## Services Used by Product Catalog
- ECR
- ECS with Fargate
- DocumentDB
- SQS
- Lambda
- Api Gateway

There are two Stacks in the code.
1. **ECRStack** with setups code build pipeline for building docker image and pushing it to ecr. ECR setup to run docker image.
2. **CdkProductCatalogStack** to setup documentdb for storing data, SQS with lambda and api gateway to store pre-order request.

*Note right now the security group for document group allows all inbound traffic, this is not a good approach and might want to modify it*