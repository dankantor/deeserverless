import { App } from './../lib/app.js';
const context = {};

describe('#App', () => {

  it('creates a new App and returns a resolved promise', async () => {
    const event = {
      "routeKey": "GET /page",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    let app = new App(event, context);
    await expectAsync(app).toBeResolved();
  });

  it('returns a status code of 200', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    let app = await new App(event, context);
    expect(app.statusCode).toEqual(200);
  });

  it('returns a 200 for dynamic route', async () => {
    const event = {
      "routeKey": "GET /users/{userId}",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      },
      "pathParameters": {
        "userId": "abc"
      }
    };
    let app = await new App(event, context);
    expect(app.statusCode).toEqual(200);
  });

  it('returns a status code of 404 when a file is not found', async () => {
    const event = {
      "routeKey": "GET /foo",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    let app = await new App(event, context);
    expect(app).toEqual({
      'statusCode': 404,
      'body': undefined,
      'headers': {'Content-Type': 'application/json'}
    });
  });

  it('returns a status code of 200 for a POST request', async () => {
    const event = {
      "routeKey": "POST /page",
      "requestContext": {
        "http": {
          "method": "POST"
        }
      }
    };
    let app = await new App(event, context);
    expect(app).toEqual({
      'statusCode': 200,
      'body': undefined,
      'headers': {'Content-Type': 'application/json'}
    });
  });

})
