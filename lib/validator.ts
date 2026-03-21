import Ajv, { type ErrorObject, type ValidateFunction } from "ajv";
import addFormats from "ajv-formats";
import sectionSchema from "../content/schemas/section.schema.json";
import pageSchema from "../content/schemas/page.schema.json";
import brandSchema from "../content/schemas/brand.schema.json";
import navigationSchema from "../content/schemas/navigation.schema.json";

const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

ajv.addSchema(sectionSchema);
ajv.addSchema(pageSchema);
ajv.addSchema(brandSchema);
ajv.addSchema(navigationSchema);

/** Which JSON document in `/content/` to validate against (schemas live in `/content/schemas/`). */
export type ContentSchemaKind = "page" | "brand" | "navigation" | "section";

const schemaByKind: Record<ContentSchemaKind, object> = {
  page: pageSchema,
  brand: brandSchema,
  navigation: navigationSchema,
  section: sectionSchema,
};

const validateCache = new Map<ContentSchemaKind, ValidateFunction>();

function getValidator(kind: ContentSchemaKind): ValidateFunction {
  let v = validateCache.get(kind);
  if (!v) {
    v = ajv.compile(schemaByKind[kind]);
    validateCache.set(kind, v);
  }
  return v;
}

function formatAjvErrors(errors: ErrorObject[] | null | undefined): string {
  if (!errors?.length) return "Validation failed";
  return errors
    .map((e) => `${e.instancePath || "/"} ${e.message ?? ""}`.trim())
    .join("; ");
}

/**
 * Validates parsed JSON against the formal content-layer schema for `kind`.
 * Use this from the AI engine before committing generated files.
 */
export function validate(
  data: unknown,
  kind: ContentSchemaKind,
): { ok: true; data: unknown } | { ok: false; error: string } {
  const validateFn = getValidator(kind);
  if (validateFn(data)) {
    return { ok: true, data };
  }
  return { ok: false, error: formatAjvErrors(validateFn.errors) };
}

export function assertValid<T>(data: unknown, kind: ContentSchemaKind): T {
  const result = validate(data, kind);
  if (!result.ok) {
    throw new Error(result.error);
  }
  return result.data as T;
}

/** Lower-level helper when you need a one-off schema (e.g. tests). */
export function validateWithSchema<T>(
  data: unknown,
  schema: object,
): { ok: true; data: T } | { ok: false; error: string } {
  const validateFn = ajv.compile(schema) as ValidateFunction<T>;
  if (validateFn(data)) {
    return { ok: true, data: data as T };
  }
  return { ok: false, error: formatAjvErrors(validateFn.errors) };
}
