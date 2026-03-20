export type Country = {
  code: string;
  label: string;
};

export const COUNTRIES: Country[] = [
  { code: "CA", label: "Canada" },
  { code: "US", label: "United States" },
  { code: "RW", label: "Rwanda" },
  { code: "KE", label: "Kenya" },
  { code: "BE", label: "Belgium" },
  { code: "FR", label: "France" },
];

/** Ready-to-use options for `FormSelect` */
export const COUNTRY_OPTIONS = COUNTRIES.map(({ code, label }) => ({
  value: code,
  label,
}));
