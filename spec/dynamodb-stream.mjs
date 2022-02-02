import {DynamoDBStream} from '../lib/dynamodb-stream.mjs';
import {Request} from './../lib/request.mjs';
import {Response} from './../lib/response.mjs';

describe('#DynamoDBStream', () => {
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
      },
      {
        "eventID": "c81e728d9d4c2f636f067f89cc14862c",
        "eventName": "MODIFY",
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
              "S": "This item has changed"
            },
            "Id": {
              "N": "101"
            }
          },
          "OldImage": {
            "Message": {
              "S": "New item!"
            },
            "Id": {
              "N": "101"
            }
          },
          "ApproximateCreationDateTime": 1428537600,
          "SequenceNumber": "4421584500000000017450439092",
          "SizeBytes": 59,
          "StreamViewType": "NEW_AND_OLD_IMAGES"
        },
        "eventSourceARN": "arn:aws:dynamodb:us-east-1:123456789012:table/my-big-table/stream/2015-06-27T00:48:05.899"
      },
      {
        "eventID": "eccbc87e4b5ce2fe28308fd9f2a7baf3",
        "eventName": "REMOVE",
        "eventVersion": "1.1",
        "eventSource": "aws:dynamodb",
        "awsRegion": "us-east-1",
        "dynamodb": {
          "Keys": {
            "Id": {
              "N": "101"
            }
          },
          "OldImage": {
            "Message": {
              "S": "This item has changed"
            },
            "Id": {
              "N": "101"
            }
          },
          "ApproximateCreationDateTime": 1428537600,
          "SequenceNumber": "4421584500000000017450439093",
          "SizeBytes": 38,
          "StreamViewType": "NEW_AND_OLD_IMAGES"
        },
        "eventSourceARN": "arn:aws:dynamodb:us-east-1:123456789012:table/my-big-table/stream/2015-06-27T00:48:05.899"
      }
    ]
  };
  
  it('sets req and res on itself', async () => {
    const request = new Request(event);
    const promise = await new Promise((resolve, _) => {
      const response = new Response(resolve);
      const stream = new DynamoDBStream(request, response);

      expect(stream.req).toEqual(request);
      expect(stream.res).toEqual(response);
    });
  });

  it('expect record eventName methods to be called with record', async () => {
    spyOn(DynamoDBStream.prototype, 'insert');
    spyOn(DynamoDBStream.prototype, 'modify');
    spyOn(DynamoDBStream.prototype, 'remove');

    const request = new Request(event);
    const promise = await new Promise((resolve, _) => {
      const response = new Response(resolve);
      new DynamoDBStream(request, response);
    });

    expect(DynamoDBStream.prototype.insert).toHaveBeenCalledOnceWith(jasmine.objectContaining({
      eventName: 'INSERT',
      eventID: 'c4ca4238a0b923820dcc509a6f75849b'
    }));
    expect(DynamoDBStream.prototype.modify).toHaveBeenCalledOnceWith(jasmine.objectContaining({
      eventName: 'MODIFY',
      eventID: 'c81e728d9d4c2f636f067f89cc14862c'
    }));
    expect(DynamoDBStream.prototype.remove).toHaveBeenCalledOnceWith(jasmine.objectContaining({
      eventName: 'REMOVE',
      eventID: 'eccbc87e4b5ce2fe28308fd9f2a7baf3'
    }));
  });
  
});
