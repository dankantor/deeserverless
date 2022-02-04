import {Request} from './../lib/request.mjs';

describe('#Request', () => {
  
  it('creates a new API Gateway Request', async () => {
    const event = {
      "routeKey": "GET /page",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    let request = new Request(event);
    expect(request.type).toEqual('aws:apigateway');
  });
  
  it('sets API Gateway Request file correctly', async () => {
    const event = {
      "routeKey": "GET /page",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    let request = new Request(event);
    expect(request.file).toEqual('apigateway/page');
  });
  
  it('sets API Gateway Request method correctly', async () => {
    const event = {
      "routeKey": "GET /page",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    let request = new Request(event);
    expect(request.method).toEqual('GET');
  });
  
  it('sets API Gateway Request quertStringParameters correctly', async () => {
    const event = {
      "routeKey": "GET /page?foo=bar",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      },
      "queryStringParameters": {
        "foo": "bar"
      }
    };
    let request = new Request(event);
    expect(request.queryStringParameters).toEqual({ foo: 'bar' });
  });
  
  it('sets API Gateway Request pathParameters correctly', async () => {
    const event = {
      "routeKey": "GET /page/{foo}",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      },
      "pathParameters": {
        "foo": "bar"
      }
    };
    let request = new Request(event);
    expect(request.pathParameters).toEqual({ foo: 'bar' });
  });
  
  it('sets API Gateway Request pathParameters correctly when last path has file extension', async () => {
    const event = {
      "routeKey": "GET /page/{foo}",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      },
      "pathParameters": {
        "foo": "bar.json"
      }
    };
    let request = new Request(event);
    expect(request.pathParameters).toEqual({ foo: 'bar' });
  });
  
  it('sets API Gateway Request cookies correctly', async () => {
    const event = {
      "routeKey": "GET /page",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      },
      "cookies": [
        "foo=bar"
      ]
    };
    let request = new Request(event);
    expect(request.cookies).toEqual({ foo: 'bar' });
  });
  
  it('sets API Gateway Request headers correctly', async () => {
    const event = {
      "routeKey": "GET /page",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      },
      "headers": {
        "Content-Type": "application/json"
      }
    };
    let request = new Request(event);
    expect(request.headers).toEqual({ 'content-type': 'application/json' });
  });
  
  it('checks for API Gateway Request valid csrf correctly', async () => {
    const event = {
      "routeKey": "GET /page",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      },
      "headers": {
        "x-csrf": "foo"
      },
      "cookies": [
        "csrf=foo"
      ]
    };
    let request = new Request(event);
    expect(request.isValidCsrf).toEqual(true);
  });
  
  it('rejects API Gateway Request invalid csrf correctly', async () => {
    const event = {
      "routeKey": "GET /page",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      },
      "headers": {
        "x-csrf": "foo"
      },
      "cookies": [
        "csrf=bar"
      ]
    };
    let request = new Request(event);
    expect(request.isValidCsrf).toEqual(false);
  });
  
  it('sets API Gateway Request body correctly', async () => {
    const event = {
      "routeKey": "GET /page",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      },
      "body": "foo"
    };
    let request = new Request(event);
    expect(request.body).toEqual('foo');
  });
  
  it('sets API Gateway Request body application/json correctly', async () => {
    const event = {
      "routeKey": "GET /page",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      },
      "headers": {
        "Content-Type": "application/json"
      },
      "body": '{"foo": "bar"}'
    };
    let request = new Request(event);
    expect(request.body).toEqual({ foo: 'bar' });
  });
  
  it('sets API Gateway fileExtension properly', async () => {
    const event = {
      "routeKey": "GET /page/foo.json",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      },
      "rawPath": "/page/foo.json"
    };
    let request = new Request(event);
    expect(request.fileExtension).toEqual('json');
  });
  
  it('creates a new Cloudwatch scheduled event Request', async () => {
    const event = {
      "source": "aws.events",
      "cronFileName": "my-scheduled-rule"
    };
    let request = new Request(event);
    expect(request.type).toEqual('aws:cloudwatch:events');
  });
  
  it('sets Cloudwatch scheduled event file correctly', async () => {
    const event = {
      "source": "aws.events",
      "cronFileName": "my-scheduled-rule"
    };
    let request = new Request(event);
    expect(request.file).toEqual('crons/my-scheduled-rule');
  });

  it('creates a new DynamoDB event Request', async () => {
    const event = {
      "Records": [
        {
          "eventID": "c4ca4238a0b923820dcc509a6f75849b",
          "eventName": "INSERT",
          "eventVersion": "1.1",
          "eventSource": "aws:dynamodb",
          "awsRegion": "us-east-1",
          "dynamodb": {
            "Keys": {
              "Id": {
                "N": "101"
              }
            },
            "NewImage": {
              "Message": {
                "S": "New item!"
              },
              "Id": {
                "N": "101"
              }
            },
            "ApproximateCreationDateTime": 1428537600,
            "SequenceNumber": "4421584500000000017450439091",
            "SizeBytes": 26,
            "StreamViewType": "NEW_AND_OLD_IMAGES"
          },
          "eventSourceARN": "arn:aws:dynamodb:us-east-1:123456789012:table/example-table/stream/2015-06-27T00:48:05.899"
        }
      ]
    };

    let request = new Request(event);
    expect(request.type).toEqual('aws:dynamodb');
  });

  it('sets DynamoDB event file correctly', async () => {
    const event = {
      "Records": [
        {
          "eventID": "c4ca4238a0b923820dcc509a6f75849b",
          "eventName": "INSERT",
          "eventVersion": "1.1",
          "eventSource": "aws:dynamodb",
          "awsRegion": "us-east-1",
          "dynamodb": {
            "Keys": {
              "Id": {
                "N": "101"
              }
            },
            "NewImage": {
              "Message": {
                "S": "New item!"
              },
              "Id": {
                "N": "101"
              }
            },
            "ApproximateCreationDateTime": 1428537600,
            "SequenceNumber": "4421584500000000017450439091",
            "SizeBytes": 26,
            "StreamViewType": "NEW_AND_OLD_IMAGES"
          },
          "eventSourceARN": "arn:aws:dynamodb:us-east-1:123456789012:table/example-table/stream/2015-06-27T00:48:05.899"
        }
      ]
    };

    let request = new Request(event);
    expect(request.file).toEqual('streams/example-table');
  });
  
})