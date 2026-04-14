const ROLE_BADGE_STYLES: Record<string, string> = {
  owner: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  admin: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  treasurer: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  secretary: "bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300",
  member: "bg-muted text-muted-foreground",
};

export function roleBadgeClass(role: string) {
  return ROLE_BADGE_STYLES[role] ?? ROLE_BADGE_STYLES.member;
}
