export default class HTMLTemplate {
  private constructor() {
    /* */
  }

  static createTemplate(templateName: string, templateValues: { [key: string]: unknown }): string {
    let html = require(`src/assets/document/${templateName}-template.html`).default as string;
    Object.keys(templateValues).forEach((key) => {
      const rawValue = templateValues[key];
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const value = Array.isArray(rawValue) ? rawValue.join('') : (rawValue as any).toString();
      html = html.replaceAll(`%${key.toUpperCase()}%`, value);
    });

    return html;
  }
}
