const context = {};

describe('#App', () => {
  
  it('creates a new App and returns a resolved promise', async () => {
    const event = {
      "routeKey": "GET /index",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = new App(event, context);
    await expectAsync(app).toBeResolved();
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
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    expect(app).toEqual({
      'statusCode': 404, 
      'body': undefined, 
      'headers': {'Content-Type': 'application/json'} 
    });
  });
  
})