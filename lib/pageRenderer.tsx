"use client";

import { Suspense } from "react";
import { defaultRegistry, resolveComponent } from "@ai-site/components";
import type { PageConfig } from "./types";

export function PageRenderer({ page }: { page: PageConfig }) {
  const contentPathPrefix = `pages.${page.slug}`;

  return (
    <>
      {page.sections.map((section, index) => {
        const Cmp = resolveComponent(defaultRegistry, section.component);
        const pathPrefix = `${contentPathPrefix}.sections[${index}]`;
        return (
          <Suspense
            key={section.id}
            fallback={<div className="min-h-[1rem]" aria-hidden />}
          >
            <Cmp
              variant={section.variant}
              content={section.content}
              settings={section.settings}
              contentPathPrefix={pathPrefix}
            />
          </Suspense>
        );
      })}
    </>
  );
}
