/** User for display / edit (mapped from UserResponse). */
export interface User {
  id: number;
  email: string;
  firstName: string;
  surname: string;
  role: string;
  address?: string;
  phoneNumber?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  pinCode?: string;
}
