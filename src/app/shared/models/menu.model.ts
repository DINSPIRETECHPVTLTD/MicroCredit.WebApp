/** App mode: organization-level or branch-level. */
export type AppMode = 'ORG' | 'BRANCH';

/** Role for menu/access. OWNER = org owner, BRANCH_ADMIN = branch admin, STAFF = branch staff, BRANCH_USER = limited branch user. */
export type AppRole = 'OWNER' | 'BRANCH_ADMIN' | 'STAFF';

/** Single menu item; can have children (submenu). */
export interface AppMenuItem {
  label: string;
  key: string;
  /** Route for navigation; omit for parent-only (expand/collapse). */
  route?: string;
  /** Show only in these modes. */
  modes?: AppMode[];
  /** Show only for these roles; omit = all roles. */
  roles?: AppRole[];
  children?: AppMenuItem[];
}
