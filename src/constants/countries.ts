export type Country = {
  value: string;
  label: string;
};

export const COUNTRIES: Country[] = [
  { value: "CA", label: "Canada" },
  { value: "US", label: "United States" },
  { value: "RW", label: "Rwanda" },
  { value: "KE", label: "Kenya" },
  { value: "BE", label: "Belgium" },
  { value: "FR", label: "France" },
];

/** Ready-to-use options for `FormSelect` */
export const COUNTRY_OPTIONS = COUNTRIES.map(({ value, label }) => ({
  value,
  label,
}));
