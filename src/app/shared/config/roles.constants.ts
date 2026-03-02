/** Organization-level roles. */
export const OrgRoles = ['Owner', 'Investor'] as const;

/** Branch-level roles. */
export const BranchRoles = ['BranchAdmin', 'Staff'] as const;

export type OrgRole = (typeof OrgRoles)[number];
export type BranchRole = (typeof BranchRoles)[number];
