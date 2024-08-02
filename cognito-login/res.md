```js
 const item = items.addResource('{itemId}');

    // Create the GET method for the /items/{itemId} resource
    item.addMethod('GET', new apigateway.MockIntegration({
      integrationResponses: [{
        statusCode: '200',
        responseTemplates: {
          'application/json': `
          #set($inputRoot = $input.path('$'))
          #if($input.params('itemId') == '1')
            {
              "id": "1",
              "name": "Item 1",
              "description": "Description of Item 1"
            }
          #elseif($input.params('itemId') == '2')
            {
              "id": "2",
              "name": "Item 2",
              "description": "Description of Item 2"
            }
          #elseif($input.params('itemId') == '3')
            {
              "id": "3",
              "name": "Item 3",
              "description": "Description of Item 3"
            }
          #else
            {
              "message": "Item not found"
            }
          #end`
        }
      }],
      passthroughBehavior: apigateway.PassthroughBehavior.NEVER,
      requestTemplates: {
        'application/json': '{"statusCode": 200}'
      }
    }));
```