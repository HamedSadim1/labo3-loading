import { NUMBER_FORMAT_CONFIG } from "@/constants";

export type NumberFormat = "integer" | "decimal" | "percent";

export const formatNumber = (
  value: number,
  format: NumberFormat,
  suffix = "",
): string => {
  const formatted =
    format === "decimal"
      ? value.toFixed(NUMBER_FORMAT_CONFIG.decimalPlaces)
      : format === "percent"
        ? Math.round(value).toString()
        : Math.round(value).toLocaleString(NUMBER_FORMAT_CONFIG.locale);

  return `${formatted}${suffix}`;
};
