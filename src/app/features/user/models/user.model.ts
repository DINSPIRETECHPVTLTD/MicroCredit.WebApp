/** User for display / edit (mapped from UserResponse). */
export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  address?: string;
}
