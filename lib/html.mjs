import {Page} from './page.mjs';


/** @class Html */
class Html extends Page {
  
  constructor(req, res) {
    res.contentType = 'text/html';
    super(req, res); 
  }
  
  /**
   * @member
   * @readonly
   * @description get the contents of the head tag. This will incorporate
   * many of the Class members (eg description, favIcon, etc)
   * @returns {string}
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
    }
    if (this.webAppTitle) {
      html += `<meta name="apple-mobile-web-app-title" content="${this.webAppTitle}">`;
      html += `<meta name="apple-mobile-web-app-capable" content="yes">`;
    }
    this.appleTouchIcons.forEach(icon => {
      html += `<link rel="apple-touch-icon" sizes="${icon.size}x${icon.size}" href="${icon.href}">`;
    });
    return html;
  }
  
  /**
   * @member
   * @description Get and Set the theme-color meta tag content
   * @param {string} Hex color
   * @returns {string}
   */
  get themeColor() {
    return this._themeColor || null;
  }
  
  set themeColor(color) {
    this._themeColor = color;
  }
  
  /**
   * @member
   * @description Get and Set the apple-mobile-web-app-title meta tag content.
   * If set this will also set the apple-mobile-web-app-capable content to yes
   * @param {string} title
   * @returns {string}
   */
  get webAppTitle() {
    return this._webAppTitle || null;
  }
  
  set webAppTitle(title) {
    this._webAppTitle = title;
  }
  
  /**
   * @member
   * @description Get and Set the url for the shortcut icon
   * @param {string} url
   * @returns {string}
   */
  get favIcon() {
    return this._favIcon;
  }
  
  set favIcon(url) {
    this._favIcon = url;
  }
  
  /**
   * @member
   * @description Get and Set the link tag apple-touch-icon sizes and href.
   * @param {Object[]} Icons
   * @param {number} Icons.size
   * @param {string} Icons.href
   * @returns {Object[]}
   */
  get appleTouchIcons() {
    return this._appleTouchIcons || [];
  }
  
  set appleTouchIcons(list) {
    this._appleTouchIcons = list;
  }
  
  /**
   * @member
   * @description Get and Set the description meta tag content. 
   * @param {string} description
   * @returns {string}
   */
  get description() {
    return this._description;
  }
  
  set description(str) {
    this._description = str;
  }
  
  /**
   * @member
   * @description Get and Set the title tag. 
   * @param {string} title
   * @returns {string}
   */
  get title() {
    return this._title;
  }
  
  set title(str) {
    this._title = str;
  }
  
  /**
   * @member
   * @description Get and Set css link tags 
   * @param {string[]} href
   * @returns {string[]}
   */
  get css() {
    return this._css || [];
  }
  
  set css(list) {
    this._css = list;
  }
  
  /**
   * @member
   * @description Get and Set the body tag. 
   * @param {string} html
   * @returns {string}
   */
  get body() {
    return this._body;
  }
  
  set body(html) {
    this._body = html;
  }
  
  /**
   * @member
   * @description Get and Set script type="text/javascript" tags
   * @param {string[]} src
   * @returns {string[]}
   */
  get scripts() {
    return this._scripts || [];
  }
  
  set scripts(list) {
    this._scripts = list;
  }
  
  /**
   * @member
   * @description Get and Set script type="module" tags
   * @param {string[]} src
   * @returns {string[]}
   */
  get scriptModules() {
    return this._scriptModules || [];
  }
  
  set scriptModules(list) {
    this._scriptModules = list;
  }
  
  /**
   * @member
   * @description Get and Set a csrf string. If set the html will insert
   * localStorage.setItem('csrf', csrf) into the body and set 'csrf' cookie.
   * Accepts a string or boolean. If boolean is true a random csrf value will be
   * created for you. 
   * @param {string|boolean} [csrf]
   * @returns {string}
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
   * @member
   * @readonly
   * @description get the contents of the document tag. This will incorporate
   * many of the Class members (eg head, body, scripts, etc)
   * @returns {string}
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
    }
    this.scriptModules.forEach(script => {
      html += `<script type="module" src="${script}"></script>`;
    });
    html += `
      </body>
      </html>
    `;
    return html;
  }
  
  
}

export {Html};