# DeeServerless

A simple framework to make working with [AWS Serverless Application Model (SAM)](https://aws.amazon.com/serverless/sam/)
a little easier.

It will turn AWS Events into an easier to use Request object and provide a Response object to easily
return to the event initiator (eg API Gateway, S3, Cloudwatch scheduled events, etc).

It will also route requests to files on your filesystem 
(eg GET /index -> `${process.cwd()}/apigateway/index.js`)

View documentation - [https://dankantor.github.io/deeserverless/](https://dankantor.github.io/deeserverless/)

For examples, check out the apigateway, ses, s3, etc folders. 

## Status

[![Node.js CI](https://github.com/dankantor/deeserverless/actions/workflows/node.js.yml/badge.svg)](https://github.com/dankantor/deeserverless/actions/workflows/node.js.yml)

## Usage

### API Gateway

app.js 

```

import { App } from 'deeserverless';

exports.lambdaHandler = async (event, context) => {
  return new App(event, context);
}
```

/apigateway/api/me.js

```
import {Page} from 'deeserverless';

class Me extends Page {
  
  constructor(req, res) {
    super(req, res);
  }
  
  // set response status code to 200 and terminate connection
  get() {
    this.res.statusCode = 200;
    this.res.json = {"status": "ok"};
    this.res.done(); 
  }
  
  post() {
    this.res.statusCode = 200;
    this.res.done();
  }
  
  
}

export { Me as default };
```

/apigateway/users_userid.js
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

### Cloudwatch Scheduled Events

Event Rule should define constant JSON payload of
```
{
  "source": "aws.events",
  "cronFileName": "my-rule"
}
```

/crons/my-rule.js

```

class MyRule {
  
  // do something and then finish by resolving res promise
  constructor(req, res) {
    console.log('cron running');
    res.resolve(null, 'Finished');
  }
  
}

export { MyRule as default };
```

### S3 Events

/s3/bucket-name.js

```

class Bucket {
  
  // do something and then finish by resolving res promise
  constructor(req, res) {
    console.log('received s3 event', req.event);
    res.resolve();
  }
  
}

export { Bucket as default };
```

### SES Incoming Event

/ses/incoming.js

```

class Incoming {
  
  // do something and then finish by resolving res promise
  constructor(req, res) {
    console.log('received ses event', req.event);
    res.resolve(null, { 'disposition' : 'CONTINUE' });
  }
  
}

export { Incoming as default };
```


### DynamoDB Stream Event

/streams/table-name.js

```
import {DynamoDBStream} from 'deeserverless';

class TableName exends DynamoDBStream {
  
  // called once per inserted record
  async insert(record) {
    // do work
  }

  // called once per modified record
  async modify(record) {
    // do work
  }

  // called once per removed record
  async remove(record) {
    // do work
  }
  
}

export { TableName as default };
```


