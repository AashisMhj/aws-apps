import aws_cdk as core
import aws_cdk.assertions as assertions

from api_meter.api_meter_stack import ApiMeterStack

# example tests. To run these tests, uncomment this file along with the example
# resource in api_meter/api_meter_stack.py
def test_sqs_queue_created():
    app = core.App()
    stack = ApiMeterStack(app, "api-meter")
    template = assertions.Template.from_stack(stack)

#     template.has_resource_properties("AWS::SQS::Queue", {
#         "VisibilityTimeout": 300
#     })
