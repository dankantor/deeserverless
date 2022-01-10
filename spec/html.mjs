const context = {};

describe('#Html', () => {
  
  it('returns a status code of 200', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    expect(app.statusCode).toEqual(200);
  });
  
  it('returns a Content-Type of text/html', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    expect(app.headers['Content-Type']).toEqual('text/html');
  });
  
  it('returns a description = "Some description"', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    let idx = app.body.indexOf(`<meta name="description" content="Some description">`);
    expect(idx).not.toBe(-1);
  });
  
  it('returns a shortcut icon href = "favicon.jpg"', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    let idx = app.body.indexOf(`<link rel="shortcut icon" href="favicon.jpg">`);
    expect(idx).not.toBe(-1);
  });
  
  it('returns a title = "Some title"', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    let idx = app.body.indexOf(`<title>Some title</title>`);
    expect(idx).not.toBe(-1);
  });
  
  it('returns link rel="stylesheet" href = "/static/style.css"', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    let idx = app.body.indexOf(`<link rel="stylesheet" type='text/css' href="/static/style.css">`);
    expect(idx).not.toBe(-1);
  });
  
  it('returns a theme-color = "#ffffff"', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    let idx = app.body.indexOf(`<meta name="theme-color" content="#ffffff" id="theme-color">`);
    expect(idx).not.toBe(-1);
  });
  
  it('returns a apple-mobile-web-app-title content = "Some webapp title"', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    let idx = app.body.indexOf(`<meta name="apple-mobile-web-app-title" content="Some webapp title">`);
    expect(idx).not.toBe(-1);
    let idx2 = app.body.indexOf(`<meta name="apple-mobile-web-app-capable" content="yes">`);
    expect(idx2).not.toBe(-1);
  });
  
  it('sets apple-touch-icon', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    let idx = app.body.indexOf(`<link rel="apple-touch-icon" sizes="152x152" href="/static/icon-152.png"><link rel="apple-touch-icon" sizes="167x167" href="/static/icon-167.png"><link rel="apple-touch-icon" sizes="180x180" href="/static/icon-180.png">`);
    expect(idx).not.toBe(-1);
  });
  
  it('sets the document body', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    let idx = app.body.indexOf(`<div>Hello World</div>`);
    expect(idx).not.toBe(-1);
  });
  
  it('sets script tags for text/javascipt', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    let idx = app.body.indexOf(`<script type="text/javascript" src="/static/index.js"></script><script type="text/javascript" src="/static/home.js"></script>`);
    expect(idx).not.toBe(-1);
  });
  
  it('sets script tags for module', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    let idx = app.body.indexOf(`<script type="module" src="/static/module.js"></script><script type="module" src="/static/component.js">`);
    expect(idx).not.toBe(-1);
  });
  
  it('sets csrf cookie and localStorage in script', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    let idx = app.headers['Set-Cookie'].indexOf('csrf=');
    expect(idx).not.toBe(-1);
    let idx2 = app.headers['Set-Cookie'].indexOf(';Secure;HttpOnly;Max-Age=604800;SameSite=Strict;Path=/;');
    expect(idx2).not.toBe(-1);
    let idx3 = app.body.indexOf(`localStorage.setItem('csrf',`);
    expect(idx3).not.toBe(-1);
  });
  
  it('returns a canonical href = "https://example.com"', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    let idx = app.body.indexOf(`<link rel="canonical" href="https://example.com">`);
    expect(idx).not.toBe(-1);
  });
  
  it('returns headBottom content = `<script type="text/javascript">const HEAD_BOTTOM_FOO = "bar";</script>`', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    let idx = app.body.indexOf(`<script type="text/javascript">const HEAD_BOTTOM_FOO = "bar";</script>`);
    expect(idx).not.toBe(-1);
  });
  
  it('returns bodyBottom content = `<script type="text/javascript">const BODY_BOTTOM_FOO = "bar";</script>`', async () => {
    const event = {
      "routeKey": "GET /html",
      "requestContext": {
        "http": {
          "method": "GET"
        }
      }
    };
    const { App } = await import('./../lib/app.mjs');
    let app = await new App(event, context);
    let idx = app.body.indexOf(`<script type="text/javascript">const BODY_BOTTOM_FOO = "bar";</script>`);
    expect(idx).not.toBe(-1);
  });

  
})