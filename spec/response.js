import {Response} from './../lib/response.js';

const promise = () => {
  return new Promise((resolve, reject) => {});
}

describe('#Request', () => {

  it('returns the Response statusCode of 500', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      expect(response.statusCode).toEqual(500);
      response.done();
    });
    expect(promise.statusCode).toEqual(500);
  });

  it('sets and returns the Response statusCode of 200', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.statusCode = 200;
      expect(response.statusCode).toEqual(200);
      response.done();
    });
    expect(promise.statusCode).toEqual(200);
  });

  it('sets and returns the Response body to "foo"', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.body = "foo";
      expect(response.body).toEqual("foo");
      response.done();
    });
    expect(promise.body).toEqual("foo");
  });

  it('sets and returns the Response body to "{foo: bar}" from json object', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.json = {"foo": "bar"};
      expect(response.body).toEqual('{"foo":"bar"}');
      response.done();
    });
    expect(promise.body).toEqual('{"foo":"bar"}');
  });

  it('returns the Response contentType of application/json', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      expect(response.contentType).toEqual('application/json');
      response.done();
    });
    expect(promise.headers['Content-Type']).toEqual('application/json');
  });

  it('sets and returns the Response contentType of text/html', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.contentType = 'text/html';
      expect(response.contentType).toEqual('text/html');
      response.done();
    });
    expect(promise.headers['Content-Type']).toEqual('text/html');
  });

  it('sets and returns the Response location to https://example.com', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.location = "https://example.com";
      expect(response.location).toEqual("https://example.com");
      response.done();
    });
    expect(promise.headers['Location']).toEqual("https://example.com");
  });

  it('sets and returns the Response cookie to foo=bar', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.cookie = {'key': 'foo', 'value': 'bar'};
      expect(response.cookies['Set-Cookie']).toEqual('foo=bar;Secure;HttpOnly;Max-Age=604800;SameSite=lax;Path=/;');
      response.done();
    });
    expect(promise.headers['Set-Cookie']).toEqual('foo=bar;Secure;HttpOnly;Max-Age=604800;SameSite=lax;Path=/;');
  });

  it('sets and returns the Response cookie to foo=bar with custom max-age', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.cookie = {'key': 'foo', 'value': 'bar', 'maxAge': '2'};
      expect(response.cookies['Set-Cookie']).toEqual('foo=bar;Secure;HttpOnly;Max-Age=2;SameSite=lax;Path=/;');
      response.done();
    });
    expect(promise.headers['Set-Cookie']).toEqual('foo=bar;Secure;HttpOnly;Max-Age=2;SameSite=lax;Path=/;');
  });

  it('sets and returns the Response cookie to foo=bar with custom expires', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.cookie = {'key': 'foo', 'value': 'bar', 'expires': 'Wed, 08 Dec 2021 15:51:28 GMT'};
      expect(response.cookies['Set-Cookie']).toEqual('foo=bar;Secure;HttpOnly;Expires=Wed, 08 Dec 2021 15:51:28 GMT;SameSite=lax;Path=/;');
      response.done();
    });
    expect(promise.headers['Set-Cookie']).toEqual('foo=bar;Secure;HttpOnly;Expires=Wed, 08 Dec 2021 15:51:28 GMT;SameSite=lax;Path=/;');
  });

  it('sets and returns the Response cookie to foo=bar without Secure', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.cookie = {'key': 'foo', 'value': 'bar', 'secure': false};
      expect(response.cookies['Set-Cookie']).toEqual('foo=bar;HttpOnly;Max-Age=604800;SameSite=lax;Path=/;');
      response.done();
    });
    expect(promise.headers['Set-Cookie']).toEqual('foo=bar;HttpOnly;Max-Age=604800;SameSite=lax;Path=/;');
  });

  it('sets and returns the Response cookie to foo=bar without HttpOnly', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.cookie = {'key': 'foo', 'value': 'bar', 'httpOnly': false};
      expect(response.cookies['Set-Cookie']).toEqual('foo=bar;Secure;Max-Age=604800;SameSite=lax;Path=/;');
      response.done();
    });
    expect(promise.headers['Set-Cookie']).toEqual('foo=bar;Secure;Max-Age=604800;SameSite=lax;Path=/;');
  });

  it('sets and returns the Response cookie to foo=bar with custom domain', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.cookie = {'key': 'foo', 'value': 'bar', 'domain': 'foo.com'};
      expect(response.cookies['Set-Cookie']).toEqual('foo=bar;Secure;Domain=foo.com;HttpOnly;Max-Age=604800;SameSite=lax;Path=/;');
      response.done();
    });
    expect(promise.headers['Set-Cookie']).toEqual('foo=bar;Secure;Domain=foo.com;HttpOnly;Max-Age=604800;SameSite=lax;Path=/;');
  });

  it('sets and returns the Response cookie to foo=bar with custom SameSite', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.cookie = {'key': 'foo', 'value': 'bar', 'sameSite': 'strict'};
      expect(response.cookies['Set-Cookie']).toEqual('foo=bar;Secure;HttpOnly;Max-Age=604800;SameSite=strict;Path=/;');
      response.done();
    });
    expect(promise.headers['Set-Cookie']).toEqual('foo=bar;Secure;HttpOnly;Max-Age=604800;SameSite=strict;Path=/;');
  });

  it('sets and returns the Response cookie to foo=bar with custom Path', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.cookie = {'key': 'foo', 'value': 'bar', 'path': '/foo'};
      expect(response.cookies['Set-Cookie']).toEqual('foo=bar;Secure;HttpOnly;Max-Age=604800;SameSite=lax;Path=/foo');
      response.done();
    });
    expect(promise.headers['Set-Cookie']).toEqual('foo=bar;Secure;HttpOnly;Max-Age=604800;SameSite=lax;Path=/foo');
  });

  it('sets and returns the isBase64Encoded response promise', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.isBase64Encoded = true;
      expect(response.isBase64Encoded).toEqual(true);
      response.done();
    });
    expect(promise.isBase64Encoded).toEqual(true);
  });

  it('sets and returns the csp Content-Security-Header with default-src object', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.csp = {'default-src': ['self']};
      expect(response.csp).toEqual("default-src 'self'");
      response.done();
    });
    expect(promise.headers['Content-Security-Policy']).toEqual("default-src 'self'");
  });

  it('sets and returns the csp Content-Security-Header with default-src and img-src object', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.csp = {'default-src': ['self'], 'img-src': ['self', 'example.com']};
      expect(response.csp).toEqual("default-src 'self'; img-src 'self' example.com");
      response.done();
    });
    expect(promise.headers['Content-Security-Policy']).toEqual("default-src 'self'; img-src 'self' example.com");
  });

  it('sets and returns the csp Content-Security-Header with style-src unsafe-inline object', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.csp = {'style-src': ['unsafe-inline']};
      expect(response.csp).toEqual("style-src 'unsafe-inline'");
      response.done();
    });
    expect(promise.headers['Content-Security-Policy']).toEqual("style-src 'unsafe-inline'");
  });

  it('sets and returns the csp Content-Security-Header with default-src string', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.csp = "default-src 'self'";
      expect(response.csp).toEqual("default-src 'self'");
      response.done();
    });
    expect(promise.headers['Content-Security-Policy']).toEqual("default-src 'self'");
  });

  it('rejects a promise with a specific error', async () => {
    try {
      let promise = await new Promise((resolve, reject) => {
        let response = new Response(resolve, reject);
        response.reject("There was an error");
      });
    } catch (err) {
      expect(err).toEqual("There was an error");
    }
  });

  it('does not throw when endTimer is set without any startTimer', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      expect(() => {
        response.endTimer = "never-started";
      }).not.toThrow();
      response.done();
    });
    expect(promise.headers['server-timing']).toBeUndefined();
  });

  it('supports setting 12 cookies and throws a clear error on the 13th', () => {
    let response = new Response(() => {});
    for (let i = 0; i < 12; i++) {
      expect(() => {
        response.cookie = {'key': `cookie${i}`, 'value': `${i}`};
      }).not.toThrow();
    }
    expect(Object.keys(response.cookies).length).toEqual(12);
    expect(() => {
      response.cookie = {'key': 'cookie12', 'value': '12'};
    }).toThrowError(/maximum of 12 cookies/);
    expect(response.cookies['undefined']).toBeUndefined();
  });

  it('sets and returns the server-timing header correctly with startTimer and endTimer', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.startTimer = "database";
      response.endTimer = "database";
      response.done();
    });
    expect(promise.headers['server-timing']).toContain(`a0;dur=`);
    expect(promise.headers['server-timing']).toContain(`;desc="database",`);
  });

  it('sets and returns the server-timing header correctly when setting timer directly', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.timer = {key: "database", value: 250};
      response.done();
    });
    expect(promise.headers['server-timing']).toContain(`a0;dur=250;desc="database",`);
  });

  it('sets and returns the server-timing header correctly when setting multiple timers', async () => {
    let promise = await new Promise((resolve, reject) => {
      let response = new Response(resolve);
      response.startTimer = "database";
      response.endTimer = "database";
      response.startTimer = "api";
      response.endTimer = "api";
      response.timer = {key: "api2", value: 250};
      response.done();
    });
    expect(promise.headers['server-timing']).toContain(`a0;dur=`);
    expect(promise.headers['server-timing']).toContain(`;desc="database",`);
    expect(promise.headers['server-timing']).toContain(`a1;dur=`);
    expect(promise.headers['server-timing']).toContain(`;desc="api",`);
    expect(promise.headers['server-timing']).toContain(`a2;dur=250;desc="api2",`);
  });

});
