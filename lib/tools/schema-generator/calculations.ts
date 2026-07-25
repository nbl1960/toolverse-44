import type { SchemaFormValues } from "./types";

/** Builds a valid schema.org JSON-LD object for the selected type from form values. Returns null if `name` is empty. */
export function buildSchemaJsonLd(values: SchemaFormValues): string | null {
  const name = values.name.trim();
  if (!name) return null;

  const base: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": values.schemaType,
  };

  if (values.description.trim()) base.description = values.description.trim();
  if (values.url.trim()) base.url = values.url.trim();
  if (values.imageUrl.trim()) base.image = values.imageUrl.trim();

  switch (values.schemaType) {
    case "Article":
      base.headline = name;
      if (values.authorName.trim()) base.author = { "@type": "Person", name: values.authorName.trim() };
      if (values.datePublished.trim()) base.datePublished = values.datePublished.trim();
      break;
    case "Product":
      base.name = name;
      if (values.price.trim()) {
        base.offers = {
          "@type": "Offer",
          price: values.price.trim(),
          priceCurrency: values.priceCurrency.trim() || "USD",
        };
      }
      break;
    case "LocalBusiness":
      base.name = name;
      if (values.address.trim()) base.address = values.address.trim();
      if (values.telephone.trim()) base.telephone = values.telephone.trim();
      break;
    case "Person":
      base.name = name;
      if (values.jobTitle.trim()) base.jobTitle = values.jobTitle.trim();
      break;
    case "Organization":
      base.name = name;
      if (values.imageUrl.trim()) base.logo = values.imageUrl.trim();
      break;
  }

  return JSON.stringify(base, null, 2);
}
