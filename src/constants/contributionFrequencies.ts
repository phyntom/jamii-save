export type ContributionFrequency = {
  value: string;
  label: string;
};

export const CONTRIBUTION_FREQUENCIES: ContributionFrequency[] = [
  { value: "weekly", label: "Weekly" },
  { value: "biweekly", label: "Biweekly" },
  { value: "monthly", label: "Monthly" },
  { value: "quarterly", label: "Quarterly" },
  { value: "annually", label: "Annually" },
];

/** Ready-to-use options for `FormSelect` */
export const CONTRIBUTION_FREQUENCY_OPTIONS = CONTRIBUTION_FREQUENCIES.map(
  ({ value, label }) => ({
    value,
    label,
  }),
);
