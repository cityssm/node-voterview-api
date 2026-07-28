import type { StreetName } from './types.js'

export function streetNamesToStringArray(streetNames: StreetName[]): string[] {
  return streetNames.map((streetName) => streetName.DisplayValue)
}
