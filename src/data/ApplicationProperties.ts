import PropertiesData from 'src/assets/application_properties.json';

export interface ApplicationProperties {
  title: string;
}

const PROPERTIES_OBJECT = PropertiesData as unknown as ApplicationProperties;

export default function getApplicationProperties(): ApplicationProperties {
  return PROPERTIES_OBJECT;
}

export function getProperty(key: keyof ApplicationProperties): string | number | boolean | undefined {
  return PROPERTIES_OBJECT[key];
}
