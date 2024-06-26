import PropertiesData from 'src/assets/application_properties.json';

export interface ApplicationProperties {
  title: string;
  maxImagesPerDay: number;
  maxImageWidth: number;
  maxImageHeight: number;
}

const PROPERTIES_OBJECT = PropertiesData as unknown as ApplicationProperties;

export default function getApplicationProperties(): ApplicationProperties {
  return PROPERTIES_OBJECT;
}

export function getProperty(key: keyof ApplicationProperties): string | number | boolean | undefined;
export function getProperty<T extends string | number | boolean>(key: keyof ApplicationProperties, defaultValue: T): T;
export function getProperty<T>(key: keyof ApplicationProperties, defaultValue?: T): T | undefined {
  const value = PROPERTIES_OBJECT[key];

  if (value === undefined) {
    return defaultValue;
  }

  return value as T;
}
