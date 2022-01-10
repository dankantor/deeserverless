import {Html} from './../lib/html.mjs';

class Index extends Html {
  
  constructor(req, res) {
    super(req, res);
  }
  
  get() {
    this.favIcon = 'favicon.jpg';
    this.description = 'Some description';
    this.title = 'Some title';
    this.css = ['/static/style.css'];
    this.themeColor = '#ffffff';
    this.webAppTitle = 'Some webapp title';
    this.canonicalUrl = 'https://example.com';
    this.headBottom = `<script type="text/javascript">const HEAD_BOTTOM_FOO = "bar";</script>`;
    this.scriptModules = ['/static/module.js','/static/component.js'];
    this.csrf = true;
    this.res.statusCode = 200;
    this.bodyBottom = `<script type="text/javascript">const BODY_BOTTOM_FOO = "bar";</script>`;
    this.res.body = this.document;
    this.res.done(); 
  }
  
  get body() {
    return `<div>Hello World</div>`;
  }
  
  get appleTouchIcons() {
    return [
      {
        'size': 152,
        'href': '/static/icon-152.png'
      },
      {
        'size': 167,
        'href': '/static/icon-167.png'
      },
      {
        'size': 180,
        'href': '/static/icon-180.png'
      }
    ];
  }
  
  get scripts() {
    return [
      '/static/index.js',
      '/static/home.js'
    ];
  }

}

export { Index as default };