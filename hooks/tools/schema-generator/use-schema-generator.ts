"use client";

import * as React from "react";
import { buildSchemaJsonLd } from "@/lib/tools/schema-generator/calculations";
import { DEFAULT_SCHEMA_TYPE } from "@/lib/tools/schema-generator/constants";
import type { SchemaFormValues } from "@/lib/tools/schema-generator/types";

const DEFAULT_VALUES: SchemaFormValues = {
  schemaType: DEFAULT_SCHEMA_TYPE,
  name: "",
  description: "",
  url: "",
  imageUrl: "",
  authorName: "",
  datePublished: "",
  price: "",
  priceCurrency: "USD",
  address: "",
  telephone: "",
  jobTitle: "",
};

interface UseSchemaGeneratorResult {
  values: SchemaFormValues;
  setField: <K extends keyof SchemaFormValues>(key: K, value: SchemaFormValues[K]) => void;
  output: string | null;
  reset: () => void;
}

export function useSchemaGenerator(): UseSchemaGeneratorResult {
  const [values, setValues] = React.useState<SchemaFormValues>(DEFAULT_VALUES);

  const setField = React.useCallback(
    <K extends keyof SchemaFormValues>(key: K, value: SchemaFormValues[K]) => {
      setValues((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const reset = React.useCallback(() => setValues(DEFAULT_VALUES), []);
  const output = React.useMemo(() => buildSchemaJsonLd(values), [values]);

  return { values, setField, output, reset };
}
