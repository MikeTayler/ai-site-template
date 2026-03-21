import type { BrandConfig as ThemeProviderBrandConfig } from "@ai-site/components";
import type { BrandConfig } from "./types";

/** Strips editorial-only fields so the result matches `ThemeProvider` / library `BrandConfig`. */
export function themeBrandFromConfig(brand: BrandConfig): ThemeProviderBrandConfig {
  return {
    colors: brand.colors,
    typography: brand.typography,
    borderRadius: brand.borderRadius,
    spacing: brand.spacing,
  };
}

/** @deprecated Use `themeBrandFromConfig` */
export const themeBrandFromFile = themeBrandFromConfig;
