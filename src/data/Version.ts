import PropertiesData from 'src/assets/version_properties.json';

export interface VersionProperties {
  major: number;
  minor: number;
  revision: number;
}

const PROPERTIES_OBJECT = PropertiesData as unknown as VersionProperties;

export default function getAppVersion(): string {
  return `v${PROPERTIES_OBJECT.major}.${PROPERTIES_OBJECT.minor}.${PROPERTIES_OBJECT.revision}`;
}
