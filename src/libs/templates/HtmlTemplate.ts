export default class HTMLTemplate {
  private constructor() {
    /* */
  }

  static createTemplate(templateName: string, templateValues: { [key: string]: unknown }): string {
    let html = require(`src/assets/document/${templateName}-template.html`).default as string;
    Object.keys(templateValues).forEach((key) => {
      const value = templateValues[key];
      html = html.replace(`%${key.toUpperCase()}%`, Array.isArray(value) ? value.join('') : (value as object).toString());
    });

    return html;
  }
}
