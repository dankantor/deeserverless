/** @class Html *
class Html {

  #themeColor;
  #webAppTitle;
  #favIcon;
  #appleTouchIcons;
  #description;
  #title;
  #css;
  
  /**
   * @member
   * @readonly
   * @description get the contents of the <head> tag. This will incorporate
   * many of the members below (eg description, favIcon)
   * @returns {string}
   */
  get head() {
    let html = `
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="description" content="${this.description}">
      <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width">
      <link rel="shortcut icon" href="${this.favIcon}">
      <title>${this.title}</title>
      ${this.css}
    `;
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
    return this.#themeColor || null;
  }
  
  set themeColor(color) {
    this.#themeColor = color;
  }
  
  /**
   * @member
   * @description Get and Set the apple-mobile-web-app-title meta tag content.
   * If set this will also set the apple-mobile-web-app-capable content to yes
   * @param {string} title
   * @returns {string}
   */
  get webAppTitle() {
    return this.#webAppTitle || null;
  }
  
  set webAppTitle(title) {
    this.#webAppTitle = title;
  }
  
  /**
   * @member
   * @description Get and Set the url for the shortcut icon
   * @param {string} url
   * @returns {string}
   */
  get favIcon() {
    return this.#favIcon;
  }
  
  set favIcon(url) {
    this.#favIcon = url;
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
    return this.#appleTouchIcons || [];
  }
  
  set appleTouchIcons(list) {
    this.#appleTouchIcons = list;
  }
  
  /**
   * @member
   * @description Get and Set the description meta tag content. 
   * @param {string} description
   * @returns {string}
   */
  get description() {
    return this.#description;
  }
  
  set description(str) {
    this.#description = str;
  }
  
  /**
   * @member
   * @description Get and Set the title tag. 
   * @param {string} title
   * @returns {string}
   */
  get title() {
    return this.#title;
  }
  
  set title(str) {
    this.#title = str;
  }
  
  /**
   * @member
   * @description Get and Set css link tags 
   * @param {string[]} href
   * @returns {string[]}
   */
  get css() {
    let html = '';
    if (this.#css) {
      this.#css.forEach(css => {
        html += `<link rel="stylesheet" type='text/css' href="${css}">`;
      });
    }
    return html;
  }
  
  set css(list) {
    this.#css = list;
  }
  
  get body() {
    return this._body;
  }
  
  set body(html) {
    this._body = html;
  }
  
  get scripts() {
    let html = '';
    if (this._scripts) {
      this._scripts.forEach(script => {
        html += `<script type="text/javascript" src="${script}"></script>`;
      });
    }
    if (this.csrf) {
      html += `<script type="text/javascript">localStorage.setItem('csrf', '${this.csrf}');</script>`;
    }
    return html;
  }
  
  set scripts(list) {
    this._scripts = list;
  }
  
  get scriptModules() {
    let html = '';
    if (this._scriptModules) {
      this._scriptModules.forEach(script => {
        html += `<script type="module" src="${script}"></script>`;
      });
    }
    return html;
  }
  
  set scriptModules(list) {
    this._scriptModules = list;
  }
  
  get csrf() {
    return this._csrf;
  }
  
  set csrf(str) {
    this._csrf = str;
  }
  
  get document() {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          ${this.head}
        </head>
        <body>
          ${this.body}
          ${this.scripts}
          ${this.scriptModules}
        </body>
      </html>
    `
  }
  
  
}

export {Html};
