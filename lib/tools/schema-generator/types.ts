export type SchemaType = "Article" | "Product" | "LocalBusiness" | "Person" | "Organization";

export interface SchemaFormValues {
  schemaType: SchemaType;
  name: string;
  description: string;
  url: string;
  imageUrl: string;
  // Article
  authorName: string;
  datePublished: string;
  // Product
  price: string;
  priceCurrency: string;
  // LocalBusiness
  address: string;
  telephone: string;
  // Person
  jobTitle: string;
}
