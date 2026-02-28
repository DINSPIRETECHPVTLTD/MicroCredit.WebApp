import { OrgResponse } from './org-response.model';

export interface AuthResponse {
  token: string;
  refreshToken?: string;
  userType: string;
  userId: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  organization?: OrgResponse; // required from API; optional for old stored session
}
