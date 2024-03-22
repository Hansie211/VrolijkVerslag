/* eslint-disable @typescript-eslint/no-unused-vars */
import JSZip from 'jszip';
import WeekReport from 'src/data/models/WeekReport';

const TEMPLATE_FILES: { [key: string]: string } = {
  '_rels/.rels': require('./res/_rels/.rels').default as string,
  'docProps/app.xml': require('./res/docProps/app.xml').default as string,
  'docProps/core.xml': require('./res/docProps/core.xml').default as string,
  'word/_rels/document.xml.rels': require('./res/word/_rels/document.xml.rels').default as string,
  'word/theme/theme1.xml': require('./res/word/theme/theme1.xml').default as string,
  'word/document.xml': require('./res/word/document.xml').default as string,
  'word/fontTable.xml': require('./res/word/fontTable.xml').default as string,
  'word/settings.xml': require('./res/word/settings.xml').default as string,
  'word/styles.xml': require('./res/word/styles.xml').default as string,
  'word/webSettings.xml': require('./res/word/webSettings.xml').default as string,
  '[Content_Types].xml': require('./res/[Content_Types].xml').default as string,
};

export default class DocxUtils {
  static async generateDocument(report: WeekReport): Promise<Blob> {
    const files = createFiles();
    const resourceInfo = createResourceMap(report);

    fillOutFile(
      {
        RESOURCES: createResourceRelations(Array.from(resourceInfo.values())),
      },
      'word/_rels/document.xml.rels',
      files
    );

    // Build the zip
    const zip = new JSZip();
    Object.keys(files).forEach((fname) => {
      const content = files[fname];
      zip.file(fname, content);
    });

    Array.from(resourceInfo.keys()).forEach((img) => {
      const info = resourceInfo.get(img) as ResourceInfo;

      addBase64File(zip, `word/${info.name}`, img);
    });

    return await zip.generateAsync({ type: 'blob' });
  }
}

function createFiles(): { [key: string]: string } {
  const result: { [key: string]: string } = {};

  Object.keys(TEMPLATE_FILES).forEach((key) => (result[key] = TEMPLATE_FILES[key]));

  return result;
}

function fillOutFile(vars: { [key: string]: object }, filename: string, files: { [key: string]: string }): void {
  Object.keys(vars).forEach((key) => {
    const value = vars[key];

    files[filename] = files[filename].replaceAll(`%${key.toUpperCase()}%`, Array.isArray(value) ? value.join('\n') : value.toString());
  });
}

function addBase64File(zip: JSZip, filename: string, dataUri: string) {
  const idx = dataUri.indexOf('base64,') + 'base64,'.length;
  const content = dataUri.substring(idx);
  zip.file(filename, content, { base64: true });
}

function createResourceRelations(resources: ResourceInfo[]): string[] {
  return resources.map((info) => {
    return `<Relationship Id="${info.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${info.name}" />`;
  });
}

interface ResourceInfo {
  name: string;
  id: string;
}

function createResourceMap(report: WeekReport): Map<string, ResourceInfo> {
  let currentName = 1;
  let currentId = 100;

  const result: Map<string, ResourceInfo> = new Map();

  Object.values(report.dayReports)
    .flatMap((day) => day.images)
    .forEach((img) => {
      const resourceName = `image/image${currentName++}.png`;
      const resourceId = `rId${currentId++}`;

      result.set(img, { name: resourceName, id: resourceId });
    });

  return result;
}

function paragraphs(text: string): string[] {
  return text
    .trim()
    .replace(/\n\s*\n/g, '\n')
    .split('\n');
}
