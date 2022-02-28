import {Page} from './../lib/page.mjs';
import {Request} from './../lib/request.mjs';
import {Response} from './../lib/response.mjs';

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
  
});