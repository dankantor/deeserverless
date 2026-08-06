import {Page} from './../lib/page.js';
import {Request} from './../lib/request.js';
import {Response} from './../lib/response.js';
import {ValidationError} from './../lib/error.js';

describe('#Page', () => {

  it('sets req and res on itself', async () => {
    const event = {
      "routeKey": "GET /page",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    let request = new Request(event);
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      let page = new Page(request, response);
      expect(page.req).toEqual(request);
      expect(page.res).toEqual(response);
    });
  });

  it('returns a 404 when page is not found', async () => {
    const event = {
      "routeKey": "GET /page",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    let request = new Request(event);
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      let page = new Page(request, response);
    });
    expect(promise.statusCode).toEqual(404);
  });

  it('resolves a 400 response when an async handler throws a ValidationError', async () => {
    class TestPage extends Page {
      async get() {
        throw new ValidationError({message: 'id is required'});
      }
    }
    spyOn(console, 'error');
    const event = {
      "routeKey": "GET /page",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    let request = new Request(event);
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve, reject);
      new TestPage(request, response);
    });
    expect(promise.statusCode).toEqual(400);
    expect(JSON.parse(promise.body)).toEqual({'status': 'id is required'});
    expect(console.error).toHaveBeenCalled();
  });

  it('resolves a 500 response when an async handler throws an unknown error', async () => {
    class TestPage extends Page {
      async get() {
        throw new Error('secret internal detail');
      }
    }
    spyOn(console, 'error');
    const event = {
      "routeKey": "GET /page",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    let request = new Request(event);
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve, reject);
      new TestPage(request, response);
    });
    expect(promise.statusCode).toEqual(500);
    expect(JSON.parse(promise.body)).toEqual({'status': 'Internal Server Error'});
    expect(console.error).toHaveBeenCalled();
  });

});
