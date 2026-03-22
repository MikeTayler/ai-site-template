import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { PageRenderer } from "@/lib/renderer";
import { SiteShell } from "@/lib/siteShell";
import { GoogleFontLinks } from "@/lib/googleFonts";
import {
  slugSegmentsToPageKey,
  readPageJsonRaw,
  readBrandJsonRaw,
  readNavigationJsonRaw,
  listPageKeys,
} from "@/lib/content-loader";
import { assertValid, validate } from "@/lib/validator";
import type { PageConfig, BrandConfig, NavigationConfig } from "@/lib/types";

export const dynamicParams = false;

export function generateStaticParams(): { slug?: string[] }[] {
  return listPageKeys().map((key) => ({
    slug: key === "home" ? [] : key.split("/"),
  }));
}

export function generateMetadata({
  params,
}: {
  params: { slug?: string[] };
}): Metadata {
  const pageKey = slugSegmentsToPageKey(params.slug);
  try {
    const raw = readPageJsonRaw(pageKey);
    const result = validate(JSON.parse(raw), "page");
    if (!result.ok) {
      return { title: "Site" };
    }
    const page = result.data as PageConfig;
    return { title: page.title, description: page.description };
  } catch {
    return { title: "Site" };
  }
}

export default function SitePage({
  params,
}: {
  params: { slug?: string[] };
}) {
  const pageKey = slugSegmentsToPageKey(params.slug);
  let page: PageConfig;
  try {
    const raw = readPageJsonRaw(pageKey);
    page = assertValid<PageConfig>(JSON.parse(raw), "page");
  } catch {
    notFound();
  }

  const brand = assertValid<BrandConfig>(
    JSON.parse(readBrandJsonRaw()),
    "brand",
  );

  const navigation = assertValid<NavigationConfig>(
    JSON.parse(readNavigationJsonRaw()),
    "navigation",
  );

  return (
    <>
      <GoogleFontLinks
        headingFont={brand.typography.headingFont}
        bodyFont={brand.typography.bodyFont}
      />
      <SiteShell brand={brand} navigation={navigation}>
        <PageRenderer page={page} />
      </SiteShell>
    </>
  );
}
