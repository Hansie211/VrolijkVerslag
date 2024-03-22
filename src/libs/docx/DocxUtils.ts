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

    const documentVars: { [key: string]: unknown } = {
      title: 'Week 13, DIT IS EEN TEST',
    };

    Object.entries(report.dayReports).forEach((entry) => {
      const dayIndex = entry[0];
      const day = entry[1];

      documentVars[`text_day_${dayIndex}`] = createTextElements(day.description);
      documentVars[`images_day_${dayIndex}`] = createImageElements(day.images, resourceInfo);
    });

    fillOutFile(documentVars, 'word/document.xml', files);

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

function fillOutFile(vars: { [key: string]: unknown }, filename: string, files: { [key: string]: string }): void {
  Object.keys(vars).forEach((key) => {
    const value = vars[key];

    files[filename] = files[filename].replaceAll(`%${key.toUpperCase()}%`, Array.isArray(value) ? value.join('\n') : (value as object).toString());
  });
}

function addBase64File(zip: JSZip, filename: string, dataUri: string) {
  const idx = dataUri.indexOf('base64,') + 'base64,'.length;
  const content = dataUri.substring(idx);
  zip.file(filename, content, { base64: true });
}

function createResourceRelations(resources: ResourceInfo[]): string[] {
  return resources.map((info) => {
    return `\t<Relationship Id="${info.id}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/image" Target="${info.name}" />`;
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

function createTextElements(text: string): string[] {
  const textFields = paragraphs(text);

  return textFields.map(
    (text) =>
      `     <w:p w14:paraId="74758167" w14:textId="4912FD4C" w:rsidR="00D27C7A" w:rsidRPr="007E2299" w:rsidRDefault="007E2299">
            <w:pPr>
                <w:rPr>
                    <w:rFonts w:ascii="Tahoma" w:hAnsi="Tahoma" w:cs="Tahoma" />
                    <w:sz w:val="28" />
                    <w:szCs w:val="28" />
                </w:rPr>
            </w:pPr>
            <w:r w:rsidRPr="007E2299">
                <w:rPr>
                    <w:rFonts w:ascii="Tahoma" w:hAnsi="Tahoma" w:cs="Tahoma" />
                    <w:sz w:val="28" />
                    <w:szCs w:val="28" />
                </w:rPr>
                <w:t>
                    ${text}
                </w:t>
            </w:r>
        </w:p>`
  );
}

function createImageElements(images: string[], resourceInfo: Map<string, ResourceInfo>): string[] {
  return images.map((image) => {
    const info = resourceInfo.get(image);
    const id = info?.id;

    return `            <w:tr w:rsidR="007E2299" w14:paraId="06E51326" w14:textId="77777777" w:rsidTr="007E2299">
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="9016" w:type="dxa" />
                    </w:tcPr>
                    <w:p w14:paraId="070C88B4" w14:textId="0C9CA1FB" w:rsidR="007E2299" w:rsidRDefault="000010FB">
                        <w:r>
                            <w:rPr>
                                <w:noProof />
                            </w:rPr>
                            <w:drawing>
                                <wp:inline distT="0" distB="0" distL="0" distR="0" wp14:anchorId="146C8B91" wp14:editId="2009EFB6">
                                    <wp:extent cx="5731510" cy="3810635" />
                                    <wp:effectExtent l="0" t="0" r="2540" b="0" />
                                    <wp:docPr id="53981492" name="Afbeelding" />
                                    <wp:cNvGraphicFramePr>
                                        <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1" />
                                    </wp:cNvGraphicFramePr>
                                    <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                                        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                            <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                                <pic:nvPicPr>
                                                    <pic:cNvPr id="0" name="Picture" />
                                                    <pic:cNvPicPr>
                                                        <a:picLocks noChangeAspect="1" noChangeArrowheads="1" />
                                                    </pic:cNvPicPr>
                                                </pic:nvPicPr>
                                                <pic:blipFill>
                                                    <a:blip r:embed="${id}" cstate="print">
                                                        <a:extLst>
                                                            <a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}">
                                                                <a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0" />
                                                            </a:ext>
                                                        </a:extLst>
                                                    </a:blip>
                                                    <a:srcRect />
                                                    <a:stretch>
                                                        <a:fillRect />
                                                    </a:stretch>
                                                </pic:blipFill>
                                                <pic:spPr bwMode="auto">
                                                    <a:xfrm>
                                                        <a:off x="0" y="0" />
                                                        <a:ext cx="5731510" cy="3810635" />
                                                    </a:xfrm>
                                                    <a:prstGeom prst="rect">
                                                        <a:avLst />
                                                    </a:prstGeom>
                                                    <a:noFill />
                                                    <a:ln>
                                                        <a:noFill />
                                                    </a:ln>
                                                </pic:spPr>
                                            </pic:pic>
                                        </a:graphicData>
                                    </a:graphic>
                                </wp:inline>
                            </w:drawing>
                        </w:r>
                    </w:p>
                </w:tc>
            </w:tr>`;
  });
}

// Image row example
/*
            <w:tr w:rsidR="007E2299" w14:paraId="06E51326" w14:textId="77777777" w:rsidTr="007E2299">
                <w:tc>
                    <w:tcPr>
                        <w:tcW w:w="9016" w:type="dxa" />
                    </w:tcPr>
                    <w:p w14:paraId="070C88B4" w14:textId="0C9CA1FB" w:rsidR="007E2299" w:rsidRDefault="000010FB">
                        <w:r>
                            <w:rPr>
                                <w:noProof />
                            </w:rPr>
                            <w:drawing>
                                <wp:inline distT="0" distB="0" distL="0" distR="0" wp14:anchorId="146C8B91" wp14:editId="2009EFB6">
                                    <wp:extent cx="5731510" cy="3810635" />
                                    <wp:effectExtent l="0" t="0" r="2540" b="0" />
                                    <wp:docPr id="53981492" name="Afbeelding" />
                                    <wp:cNvGraphicFramePr>
                                        <a:graphicFrameLocks xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main" noChangeAspect="1" />
                                    </wp:cNvGraphicFramePr>
                                    <a:graphic xmlns:a="http://schemas.openxmlformats.org/drawingml/2006/main">
                                        <a:graphicData uri="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                            <pic:pic xmlns:pic="http://schemas.openxmlformats.org/drawingml/2006/picture">
                                                <pic:nvPicPr>
                                                    <pic:cNvPr id="0" name="Picture" />
                                                    <pic:cNvPicPr>
                                                        <a:picLocks noChangeAspect="1" noChangeArrowheads="1" />
                                                    </pic:cNvPicPr>
                                                </pic:nvPicPr>
                                                <pic:blipFill>
                                                    <a:blip r:embed="${id}" cstate="print">
                                                        <a:extLst>
                                                            <a:ext uri="{28A0092B-C50C-407E-A947-70E740481C1C}">
                                                                <a14:useLocalDpi xmlns:a14="http://schemas.microsoft.com/office/drawing/2010/main" val="0" />
                                                            </a:ext>
                                                        </a:extLst>
                                                    </a:blip>
                                                    <a:srcRect />
                                                    <a:stretch>
                                                        <a:fillRect />
                                                    </a:stretch>
                                                </pic:blipFill>
                                                <pic:spPr bwMode="auto">
                                                    <a:xfrm>
                                                        <a:off x="0" y="0" />
                                                        <a:ext cx="5731510" cy="3810635" />
                                                    </a:xfrm>
                                                    <a:prstGeom prst="rect">
                                                        <a:avLst />
                                                    </a:prstGeom>
                                                    <a:noFill />
                                                    <a:ln>
                                                        <a:noFill />
                                                    </a:ln>
                                                </pic:spPr>
                                            </pic:pic>
                                        </a:graphicData>
                                    </a:graphic>
                                </wp:inline>
                            </w:drawing>
                        </w:r>
                    </w:p>
                </w:tc>
            </w:tr>
 */

// Text paragraph example
/*
        <w:p w14:paraId="74758167" w14:textId="4912FD4C" w:rsidR="00D27C7A" w:rsidRPr="007E2299" w:rsidRDefault="007E2299">
            <w:pPr>
                <w:rPr>
                    <w:rFonts w:ascii="Tahoma" w:hAnsi="Tahoma" w:cs="Tahoma" />
                    <w:sz w:val="28" />
                    <w:szCs w:val="28" />
                </w:rPr>
            </w:pPr>
            <w:r w:rsidRPr="007E2299">
                <w:rPr>
                    <w:rFonts w:ascii="Tahoma" w:hAnsi="Tahoma" w:cs="Tahoma" />
                    <w:sz w:val="28" />
                    <w:szCs w:val="28" />
                </w:rPr>
                <w:t>
                    ${text}
                </w:t>
            </w:r>
        </w:p>
*/
