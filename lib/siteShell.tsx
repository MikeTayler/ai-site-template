"use client";

import { Suspense } from "react";
import {
  ThemeProvider,
  defaultRegistry,
  resolveComponent,
  type BrandConfig,
} from "@ai-site/components";
import type { NavItem, NavigationConfig } from "./types";

const SiteHeader = resolveComponent(defaultRegistry, "SiteHeader");
const SiteFooter = resolveComponent(defaultRegistry, "SiteFooter");

/** Flat list for `SiteHeader` (top-level links only; nested `children` omitted until header supports dropdowns). */
function headerLinksFromItems(items: NavItem[]): { label: string; href: string }[] {
  return items.map(({ label, href }) => ({ label, href }));
}

export function SiteShell({
  brand,
  navigation,
  children,
}: {
  brand: BrandConfig;
  navigation: NavigationConfig;
  children: React.ReactNode;
}) {
  return (
    <ThemeProvider brand={brand}>
      <Suspense fallback={<div className="min-h-[3.5rem]" aria-hidden />}>
        <SiteHeader
          variant="sticky"
          content={{
            siteTitle: navigation.siteTitle,
            navLinks: headerLinksFromItems(navigation.items),
            cta: navigation.cta,
          }}
          settings={{ background: "background", maxWidth: "wide" }}
          contentPathPrefix="navigation.siteHeader"
        />
      </Suspense>
      <main className="min-h-screen">{children}</main>
      <Suspense fallback={<div className="min-h-[8rem]" aria-hidden />}>
        <SiteFooter
          variant="multi-column"
          content={{
            copyrightText: navigation.footer.copyrightText,
            tagline: navigation.footer.tagline,
            columns: navigation.footer.columns,
          }}
          settings={{ background: "neutral" }}
          contentPathPrefix="navigation.siteFooter"
        />
      </Suspense>
    </ThemeProvider>
  );
}
