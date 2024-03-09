import PropertiesData from 'src/assets/environment_properties.json';

export interface EnvironmentProperties {
  is_debug: boolean;
}

const PROPERTIES_OBJECT = PropertiesData as unknown as EnvironmentProperties;

export default function getEnvironmentProperties(): EnvironmentProperties {
  return PROPERTIES_OBJECT;
}

export function getEnv(key: keyof EnvironmentProperties): string | number | boolean | undefined {
  return PROPERTIES_OBJECT[key];
}
