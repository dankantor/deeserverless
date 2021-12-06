class Html {
  
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
  
  get themeColor() {
    return this._themeColor || null;
  }
  
  set themeColor(color) {
    this._themeColor = color;
  }
  
  get webAppTitle() {
    return this._webAppTitle || null;
  }
  
  set webAppTitle(title) {
    this._webAppTitle = title;
  }
  
  get favIcon() {
    return this._favIcon;
  }
  
  set favIcon(href) {
    this._favIcon = href;
  }
  
  get appleTouchIcons() {
    return this._appleTouchIcons || [];
  }
  
  set appleTouchIcons(list) {
    this._appleTouchIcons = list;
  }
  
  get description() {
    return this._description;
  }
  
  set description(str) {
    this._description = str;
  }
  
  get title() {
    return this._title;
  }
  
  set title(str) {
    this._title = str;
  }
  
  get css() {
    let html = '';
    if (this._css) {
      this._css.forEach(css => {
        html += `<link rel="stylesheet" type='text/css' href="${css}">`;
      });
    }
    return html;
  }
  
  set css(list) {
    this._css = list;
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