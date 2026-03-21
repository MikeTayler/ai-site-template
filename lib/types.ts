import type { BrandConfig as ThemeProviderBrandConfig } from "@ai-site/components";

/** Re-export theme shape from the component library for convenience. */
export type { ThemeProviderBrandConfig };

export type { ImageConfig, SiteImageProps, SiteImageSizeContext } from "./image";

/**
 * Section `settings` — common keys used across registry components (see component schemas for allowed values).
 */
export interface SectionSettings {
  spacing?: string;
  background?: string;
  maxWidth?: string;
  /** Optional fragment / anchor id for deep links when the renderer supports it. */
  anchor?: string;
}

/**
 * One block in `PageConfig.sections` — maps JSON to a registry component.
 */
export interface SectionConfig {
  id: string;
  component: string;
  variant: string;
  /** Component-specific props (validated per component in `@ai-site/components`). */
  content: Record<string, unknown>;
  settings?: SectionSettings;
}

/**
 * Page definition stored in `/content/pages/*.json` (see PROJECT.md).
 */
export interface PageConfig {
  slug: string;
  title: string;
  description: string;
  sections: SectionConfig[];
}

/** @deprecated Use `PageConfig` */
export type PageDefinition = PageConfig;
/** @deprecated Use `SectionConfig` */
export type PageSection = SectionConfig;

/**
 * Full brand file at `/content/brand.json`.
 * `ThemeProvider` uses `themeBrandFromConfig()` subset; `logo` and `voice` inform assets and the AI engine.
 */
export interface BrandConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    neutral: string;
    background: string;
    text: string;
    textLight: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    baseSize: number;
    scale: number;
  };
  borderRadius: "none" | "small" | "medium" | "large";
  spacing: "compact" | "normal" | "relaxed";
  logo: {
    light: string;
    dark: string;
  };
  voice: {
    tone: string[];
    industry: string;
    audience: string;
    keywords: string[];
    avoid: string[];
  };
}

/** @deprecated Use `BrandConfig` */
export type BrandFile = BrandConfig;

/** Single nav entry; `children` supports nested menus (header currently uses top-level labels/hrefs). */
export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface FooterColumn {
  heading?: string;
  links: NavItem[];
}

export interface NavigationFooter {
  copyrightText: string;
  tagline?: string;
  columns?: FooterColumn[];
}

/**
 * Global chrome at `/content/navigation.json`.
 */
export interface NavigationConfig {
  siteTitle: string;
  /** Primary navigation items (`items` is the canonical field; aligns with nested nav in AI output). */
  items: NavItem[];
  cta?: { label: string; href: string };
  footer: NavigationFooter;
}

/** @deprecated Use `NavigationConfig` */
export type NavigationFile = NavigationConfig;
