export type CURRENCIES = {
  value: string;
  label: string;
};

export const CURRENCIES: CURRENCIES[] = [
  { value: "USD", label: "USD" },
  { value: "CAD", label: "CAD" },
  { value: "EUR", label: "EUR" },
  { value: "GBP", label: "GBP" },
  { value: "KES", label: "KES" },
  { value: "RWF", label: "RWF" },
];

/** Ready-to-use options for `FormSelect` */
export const CURRENCY_OPTIONS = CURRENCIES.map(({ value, label }) => ({
  value,
  label,
}));
