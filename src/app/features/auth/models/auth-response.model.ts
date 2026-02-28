import { OrgResponse } from './org-response.model';
import { BranchResponse } from './branch-response.model';

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  userType: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  mode?: string; // "ORG" | "BRANCH"; default "ORG"
  organization?: OrgResponse;
  branch?: BranchResponse | null;
}
