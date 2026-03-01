/** Request payload for updating a user (PUT/PATCH). */
export interface UpdateUserRequest {
  firstName: string;
  surname: string;
  role: string;
  email: string;
  phoneNumber?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  pinCode?: string | null;
  level: string;
}
