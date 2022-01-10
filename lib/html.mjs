import {Page} from './page.mjs';


class Html extends Page {
  
  /**
   * @constructs
   * @description Create a new Html object. Sets the Response.contentType to 'text/html'
   * @param {Request} request - The Request object passed to your Class
   * @param {Response} response - The Response object passed to your Class 
   */
  constructor(req, res) {
    res.contentType = 'text/html';
    super(req, res); 
  }
  
  /**
   * @type {string}
   * @readonly
   * @description get the contents of the head tag. This will incorporate
   * many of the Class members (eg description, favIcon, etc)
   */
  get head() {
    let html = `
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="description" content="${this.description}">
      <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
      <link rel="shortcut icon" href="${this.favIcon}">
      <title>${this.title}</title>
    `;
    this.css.forEach(css => {
      html += `<link rel="stylesheet" type='text/css' href="${css}">`;
    });
    if (this.themeColor) {
      html += `<meta name="theme-color" content="${this.themeColor}" id="theme-color">`;
    };
    if (this.webAppTitle) {
      html += `<meta name="apple-mobile-web-app-title" content="${this.webAppTitle}">`;
      html += `<meta name="apple-mobile-web-app-capable" content="yes">`;
    };
    this.appleTouchIcons.forEach(icon => {
      html += `<link rel="apple-touch-icon" sizes="${icon.size}x${icon.size}" href="${icon.href}">`;
    });
    if (this.canonicalUrl) {
      html += `<link rel="canonical" href="${this.canonicalUrl}">`;
    }
    if (this.headBottom) {
      html += this.headBottom;
    }
    return html;
  }
  
  /**
   * @type {string}
   * @description Get and Set the theme-color meta tag content
   * @property {string} Hex color
   * @example html.themeColor = '#ffffff';
   */
  get themeColor() {
    return this._themeColor || null;
  }
  
  set themeColor(color) {
    this._themeColor = color;
  }
  
  /**
   * @type {string}
   * @description Get and Set the apple-mobile-web-app-title meta tag content.
   *  If set this will also set the apple-mobile-web-app-capable content to yes
   * @property {string} title
   * @example html.webAppTitle = 'Some title';
   */
  get webAppTitle() {
    return this._webAppTitle || null;
  }
  
  set webAppTitle(title) {
    this._webAppTitle = title;
  }
  
  /**
   * @type {string}
   * @description Get and Set the url for the shortcut icon
   * @property {string} str - The url to set
   * @example html.favIcon = 'https://example.com/favicon.png';
   */
  get favIcon() {
    return this._favIcon;
  }
  
  set favIcon(url) {
    this._favIcon = url;
  }
  
  /**
   * @type {Object[]}
   * @description Get and Set the link tag apple-touch-icon sizes and href.
   * @property {Object[]} Icons
   * @property {number} Icons.size
   * @property {string} Icons.href
   * @example 
   *  html.appleTouchIcons = [
   *    {'size': 152, 'href': '/static/icon-152.png'},
   *    {'size': 167, 'href': '/static/icon-167.png'},
   *    {'size': 180, 'href': '/static/icon-180.png'}
   *  ]
   */
  get appleTouchIcons() {
    return this._appleTouchIcons || [];
  }
  
  set appleTouchIcons(list) {
    this._appleTouchIcons = list;
  }
  
  /**
   * @type {string}
   * @description Get and Set the canonical link href.
   * @property {string} href
   * @example html.canonicalUrl = 'https://example.com';
   */
  get canonicalUrl() {
    return this._canonicalUrl || null;
  }
  
  set canonicalUrl(href) {
    this._canonicalUrl = href;
  }
  
  /**
   * @type {string}
   * @description Get and Set the description meta tag content. 
   * @property {string} description
   * @example html.description = 'Some description';
   */
  get description() {
    return this._description;
  }
  
  set description(str) {
    this._description = str;
  }
  
  /**
   * @type {string}
   * @description Get and Set the title tag. 
   * @property {string} title
   * @example html.title = 'Some title';
   */
  get title() {
    return this._title;
  }
  
  set title(str) {
    this._title = str;
  }
  
  /**
   * @type {string[]}
   * @description Get and Set css link tags 
   * @property {string[]} href
   * @example html.css = ['style.css', 'fonts.css']
   */
  get css() {
    return this._css || [];
  }
  
  set css(list) {
    this._css = list;
  }
  
  /**
   * @type {string}
   * @description Get and Set the body tag. 
   * @param {string} html
   * @example html.body = "<div>hello world</div>";
   */
  get body() {
    return this._body;
  }
  
  set body(html) {
    this._body = html;
  }
  
  /**
   * @type {string[]}
   * @description Get and Set script type="text/javascript" tags
   * @property {string[]} src
   * @example html.scripts = ['index.js', 'home.js'];
   */
  get scripts() {
    return this._scripts || [];
  }
  
  set scripts(list) {
    this._scripts = list;
  }
  
  /**
   * @type {string[]}
   * @description Get and Set script type="module" tags
   * @property {string[]} src
   * @example html.scripts = ['module.js', 'component.js'];
   */
  get scriptModules() {
    return this._scriptModules || [];
  }
  
  set scriptModules(list) {
    this._scriptModules = list;
  }
  
  /**
   * @type {string}
   * @description Get and Set a csrf string. If set the html will insert
   *  localStorage.setItem('csrf', csrf) into the body and set 'csrf' cookie.
   *  Accepts a string or boolean. If boolean is true a random csrf value will be
   *  created for you. 
   * @property {string|boolean} [csrf]
   * @example html.csrf = true;
   */
  get csrf() {
    return this._csrf;
  }
  
  set csrf(data) {
    if (typeof data === 'boolean' && data === true) {
      data = Math.random().toString(36).slice(2);
    }
    this._csrf = data;
    this.res.csrf = data;
  }
  
  /**
   * @type {string}
   * @description Get and Set any string at bottom of <head> tag (eg extra scripts)
   * @property {string} str
   * @example html.headBottom = `<script type="text/javascript">const FOO = 'bar';</script>`;
   */
  get headBottom() {
    return this._headBottom || null;
  }
  
  set headBottom(str) {
    this._headBottom = str;
  }
  
  /**
   * @type {string}
   * @description Get and Set any string at bottom of <body> tag (eg extra scripts)
   * @property {string} str
   * @example html.bodyBottom = `<script type="text/javascript">const FOO = 'bar';</script>`;
   */
  get bodyBottom() {
    return this._bodyBottom || null;
  }
  
  set bodyBottom(str) {
    this._bodyBottom = str;
  }
  
  /**
   * @type {string}
   * @readonly
   * @description get the contents of the document tag. This will incorporate
   *  many of the Class members (eg head, body, scripts, etc)
   */
  get document() {
    let html = `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.head}
        </head>
        <body>
          ${this.body}
    `;
    this.scripts.forEach(script => {
      html += `<script type="text/javascript" src="${script}"></script>`;
    });
    if (this.csrf) {
      html += `<script type="text/javascript">localStorage.setItem('csrf', '${this.csrf}');</script>`;
    };
    this.scriptModules.forEach(script => {
      html += `<script type="module" src="${script}"></script>`;
    });
    if (this.bodyBottom) {
      html += this.bodyBottom;
    };
    html += `
      </body>
      </html>
    `;
    return html;
  }
  
  
}

export {Html};