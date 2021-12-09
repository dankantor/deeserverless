# DeeServerless

A simple framework to make working with [AWS Serverless Application Model (SAM)](https://aws.amazon.com/serverless/sam/)
a little easier.

View documentation - [https://dankantor.github.io/deeserverless/](https://dankantor.github.io/deeserverless/)

For examples, check out the apigateway, ses, s3, etc folders. 

## Status

[![Node.js CI](https://github.com/dankantor/deeserverless/actions/workflows/node.js.yml/badge.svg)](https://github.com/dankantor/deeserverless/actions/workflows/node.js.yml)

## Usage

app.mjs 

```
exports.lambdaHandler = async (event, context) => {
  const { App } = await import('deeserverless');
  return new App(event, context);
}
```

/api/me.mjs

```
import {Page} from 'deeserverless';

class Me extends Page {
  
  constructor(req, res) {
    super(req, res);
  }
  
  // set reponse status code to 200 and terminate connection
  get() {
    this.res.statusCode = 200;
    this.res.done(); 
  }
  
  post() {
    this.res.statusCode = 200;
    this.res.done();
  }
  
  
}

export { Me as default };
```

/index.mjs
```
import {Html} from 'deeserverless';

class Index extends Html {
  
  constructor(req, res) {
    super(req, res);
  }
  
  get() {
    this.favIcon = 'favicon.jpg';
    this.description = 'Some description';
    this.title = 'Some title';
    this.css = ['/static/style.css'];
    this.scriptModules = ['/static/module.js','/static/component.js'];
    this.csrf = true;
    this.res.statusCode = 200;
    this.res.body = this.document;
    this.res.done(); 
  }

}

export { Index as default };
```

